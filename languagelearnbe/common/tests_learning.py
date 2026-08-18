from datetime import timedelta

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from common.models import Level
from listening.models import AudioLesson, ListeningExercise
from question.models import Quiz, Question
from reading.models import ReadingLesson, ReadingComprehension
from sentence.models import SentenceStructure, SentenceVocabularyItem
from vocabulary.models import Vocabulary, UserVocabulary

Account = get_user_model()


class LearningLoopAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = Account.objects.create_user(username='loop', email='l@t.com', password='pass12345')
        self.client.force_authenticate(user=self.user)
        self.level = Level.objects.create(name='A1', code='A1', order=1)
        self.vocab = Vocabulary.objects.create(word='cat', meaning='mèo', part_of_speech='noun', level=self.level)

    def test_review_word_persists_srs(self):
        res = self.client.post('/api/user-vocabulary/review_word/', {
            'vocabulary_id': self.vocab.id, 'is_correct': True
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        uv = UserVocabulary.objects.get(user=self.user, vocabulary=self.vocab)
        self.assertEqual(uv.mastery_level, 1)
        self.assertIsNotNone(uv.next_review)

    def test_listening_submit_grades_server_side(self):
        lesson = AudioLesson.objects.create(
            title='L1', description='d', duration=timedelta(seconds=10),
            level=self.level, order=1, is_published=True,
        )
        ex = ListeningExercise.objects.create(
            lesson=lesson, question='Q', correct_answer='a', options={'a': 'yes', 'b': 'no'}, order=1
        )
        res = self.client.post(f'/api/listening-exercises/{ex.id}/submit_answer/', {'answer': 'b'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertFalse(res.data['is_correct'])

    def test_quiz_submit_retake(self):
        quiz = Quiz.objects.create(title='Q', passing_score=50, is_published=True, order=1)
        q = Question.objects.create(quiz=quiz, question_text='2+2', options={'a': '4', 'b': '3'}, correct_answer='a', order=1)
        r1 = self.client.post(f'/api/quizzes/{quiz.id}/submit/', {'answers': {str(q.id): 'a'}}, format='json')
        self.assertEqual(r1.status_code, status.HTTP_201_CREATED)
        self.assertTrue(r1.data['passed'])
        r2 = self.client.post(f'/api/quizzes/{quiz.id}/submit/', {'answers': {str(q.id): 'b'}}, format='json')
        self.assertEqual(r2.status_code, status.HTTP_201_CREATED)
        self.assertFalse(r2.data['passed'])

    def test_reading_submit(self):
        lesson = ReadingLesson.objects.create(title='R', content='hello', is_published=True, order=1)
        q = ReadingComprehension.objects.create(
            lesson=lesson, question_text='Q', options={'a': '1', 'b': '2'}, correct_answer='a', order=1
        )
        res = self.client.post(
            f'/api/reading-lessons/{lesson.id}/submit_comprehension/',
            {'answers': {str(q.id): 'a'}},
            format='json',
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['correct'], 1)

    def test_sentence_submit(self):
        s = SentenceStructure.objects.create(pattern='SVO', formula='S+V+O', description='d', is_published=True)
        item = SentenceVocabularyItem.objects.create(sentence=s, word='go', meaning='đi')
        res = self.client.post(
            f'/api/sentence-structures/{s.id}/submit_exercise/',
            {'answers': {str(item.id): 'go'}},
            format='json',
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['correct'], 1)

    def test_preferences_me_dark_mode(self):
        res = self.client.get('/api/preferences/me/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertFalse(res.data['dark_mode'])
        patched = self.client.patch(
            '/api/preferences/me/',
            {'dark_mode': True, 'daily_goal': 45},
            format='json',
        )
        self.assertEqual(patched.status_code, status.HTTP_200_OK)
        self.assertTrue(patched.data['dark_mode'])
        self.assertEqual(patched.data['daily_goal'], 45)
