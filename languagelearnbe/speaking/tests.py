from datetime import timedelta

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from common.models import Level, Topic
from speaking.models import (
    SpeakingLesson, PronunciationPattern, SpeakingExercise,
    UserSpeakingProgress, UserSpeakingAttempt,
)

Account = get_user_model()


def make_lesson(**kwargs):
    defaults = dict(
        title='Basic Sounds',
        description='Practice',
        instruction='Speak clearly',
        duration=timedelta(seconds=60),
        order=1,
        is_published=True,
    )
    defaults.update(kwargs)
    return SpeakingLesson.objects.create(**defaults)


def make_exercise(lesson, **kwargs):
    defaults = dict(
        lesson=lesson,
        title='Repeat hello',
        instruction='Repeat',
        prompt='hello',
        exercise_type='repeat',
        expected_duration=timedelta(seconds=5),
        sample_answer='hello',
        order=1,
    )
    defaults.update(kwargs)
    return SpeakingExercise.objects.create(**defaults)


class SpeakingLessonViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = Account.objects.create_user(
            username='sp_user', email='s@t.com', password='pass123'
        )
        self.level = Level.objects.create(name='A1', code='A1', order=1)
        self.topic = Topic.objects.create(name='Pronunciation', order=1)
        self.lesson = make_lesson(level=self.level)
        self.lesson.topics.add(self.topic)

    def test_list_lessons(self):
        response = self.client.get('/api/speaking-lessons/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)

    def test_create_lesson_as_user(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'title': 'Advanced', 'description': 'Advanced speaking',
            'level': self.level.id, 'order': 2,
            'topics': [self.topic.id],
            'duration': '00:00:10',
            'instruction': 'Go',
        }
        response = self.client.post('/api/speaking-lessons/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_search_lessons(self):
        response = self.client.get('/api/speaking-lessons/?search=Basic')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class PronunciationPatternViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.level = Level.objects.create(name='A1', code='A1', order=1)
        self.pattern = PronunciationPattern.objects.create(
            pattern='TH',
            description='TH sound',
            example_words=['think', 'the'],
            level=self.level,
            order=1,
        )

    def test_list_patterns(self):
        response = self.client.get('/api/pronunciation-patterns/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)


class SpeakingExerciseViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = Account.objects.create_user(
            username='ex_u', email='eu@t.com', password='pass123'
        )
        self.level = Level.objects.create(name='A1', code='A1', order=1)
        self.lesson = make_lesson(level=self.level)
        self.exercise = make_exercise(self.lesson)

    def test_list_exercises(self):
        response = self.client.get('/api/speaking-exercises/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_filter_by_lesson(self):
        response = self.client.get(f'/api/speaking-exercises/?lesson={self.lesson.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_submit_self_score(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            '/api/speaking-attempts/submit_self_score/',
            {'exercise': self.exercise.id, 'self_score': 80, 'duration_seconds': 5},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        attempt = UserSpeakingAttempt.objects.get(user=self.user)
        self.assertEqual(attempt.pronunciation_score, 80)
        self.assertEqual(int(attempt.duration.total_seconds()), 5)
        self.assertFalse(attempt.audio_recording)


class UserSpeakingProgressViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = Account.objects.create_user(
            username='sp_prog', email='sp@t.com', password='pass123'
        )
        self.level = Level.objects.create(name='A1', code='A1', order=1)
        self.lesson = make_lesson(level=self.level)
        self.progress = UserSpeakingProgress.objects.create(
            user=self.user, lesson=self.lesson,
            completed=True, total_practice_time=timedelta(seconds=300),
        )

    def test_list_progress(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/speaking-progress/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
