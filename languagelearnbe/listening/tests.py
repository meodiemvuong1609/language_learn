from datetime import timedelta
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from common.models import Level, Topic
from listening.models import AudioLesson, ListeningExercise, UserListeningProgress

Account = get_user_model()

class AudioLessonViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = Account.objects.create_user(
            username='listen_user', email='l@t.com', password='pass123'
        )
        self.level = Level.objects.create(name='A1', code='A1', order=1)
        self.topic = Topic.objects.create(name='Daily Life', order=1)
        self.lesson = AudioLesson.objects.create(
            title='Greetings',
            description='Learn greetings',
            duration=timedelta(seconds=120),
            level=self.level,
            order=1,
        )
        self.lesson.topics.add(self.topic)

    def test_list_published_lessons(self):
        response = self.client.get('/api/audio-lessons/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)

    def test_create_lesson_as_anon(self):
        data = {
            'title': 'Test', 'description': 'Desc',
            'duration': timedelta(seconds=60), 'level': self.level.id, 'order': 1
        }
        response = self.client.post('/api/audio-lessons/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_lesson_as_user(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'title': 'New Lesson', 'description': 'Desc',
            'duration': '00:01:00', 'level': self.level.id, 'order': 2,
            'topics': [self.topic.id]
        }
        response = self.client.post('/api/audio-lessons/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_filter_by_level(self):
        response = self.client.get(f'/api/audio-lessons/?level={self.level.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should filter correctly based on level ID
        if len(response.data['results']) > 0:
            for lesson in response.data['results']:
                self.assertEqual(lesson['level'], self.level.id)

    def test_search_lessons(self):
        response = self.client.get('/api/audio-lessons/?search=Greet')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)

class ListeningExerciseViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = Account.objects.create_user(
            username='ex_user', email='e@t.com', password='pass123'
        )
        self.level = Level.objects.create(name='A1', code='A1', order=1)
        self.lesson = AudioLesson.objects.create(
            title='Test Lesson', description='Desc',
            duration=timedelta(seconds=60), level=self.level, order=1
        )
        self.exercise = ListeningExercise.objects.create(
            lesson=self.lesson, question='What did you hear?',
            correct_answer='hello', options={'a': 'hello', 'b': 'world'}, order=1,
        )

    def test_list_exercises(self):
        response = self.client.get('/api/listening-exercises/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)

    def test_filter_by_lesson(self):
        response = self.client.get(
            f'/api/listening-exercises/?lesson={self.lesson.id}'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_submit_answer_correct(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            f'/api/listening-exercises/{self.exercise.id}/submit_answer/',
            {'answer': 'hello', 'time_taken': 10}, format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['is_correct'])

    def test_submit_answer_incorrect(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            f'/api/listening-exercises/{self.exercise.id}/submit_answer/',
            {'answer': 'world', 'time_taken': 15}, format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['is_correct'])

    def test_submit_answer_missing_fields(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            f'/api/listening-exercises/{self.exercise.id}/submit_answer/',
            {'answer': 'hello'}, format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class UserListeningProgressViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = Account.objects.create_user(
            username='prog_user', email='p@t.com', password='pass123'
        )
        self.level = Level.objects.create(name='A1', code='A1', order=1)
        self.lesson = AudioLesson.objects.create(
            title='Prog Lesson', description='Desc', duration=timedelta(seconds=60), level=self.level, order=1
        )
        self.progress = UserListeningProgress.objects.create(
            user=self.user, lesson=self.lesson, last_position=timedelta(seconds=30), completed=True, times_played=1
        )

    def test_list_progress(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/listening-progress/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)

    def test_statistics_action(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/listening-progress/statistics/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        self.assertIn('total_lessons', data)
        self.assertIn('accuracy', data)

    def test_toggle_favorite_action(self):
        self.client.force_authenticate(user=self.user)
        initial = self.progress.favorite
        response = self.client.post(
            f'/api/listening-progress/{self.progress.id}/toggle_favorite/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.progress.refresh_from_db()
        self.assertEqual(self.progress.favorite, not initial)
