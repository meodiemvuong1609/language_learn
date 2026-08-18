from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from common.models import Level, Topic
from question.models import Quiz, Question, UserQuizAttempt

Account = get_user_model()


class QuizViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = Account.objects.create_user(
            username='quiz_user', email='q@t.com', password='pass123'
        )
        self.level = Level.objects.create(name='A1', code='A1', order=1)
        self.topic = Topic.objects.create(name='Reading', order=1)
        self.quiz = Quiz.objects.create(
            title='Basics Quiz',
            description='Test basics',
            level=self.level,
            time_limit=10,
            passing_score=70,
            order=1,
            is_published=True,
        )
        self.quiz.topics.add(self.topic)
        self.question = Question.objects.create(
            quiz=self.quiz,
            question_text='What is 2+2?',
            options={'a': '3', 'b': '4', 'c': '5', 'd': '6'},
            correct_answer='b',
            difficulty=1,
            points=1,
            order=1,
        )
        self.quiz.questions_count = 1
        self.quiz.save()

    def test_list_quizzes(self):
        response = self.client.get('/api/quizzes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)

    def test_retrieve_quiz_includes_questions(self):
        response = self.client.get(f'/api/quizzes/{self.quiz.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('questions', response.data)

    def test_create_quiz_as_user(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'title': 'New Quiz',
            'description': 'Desc',
            'level': self.level.id,
            'time_limit': 15,
            'passing_score': 80,
            'order': 2,
            'topics': [self.topic.id],
        }
        response = self.client.post('/api/quizzes/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_search_quizzes(self):
        response = self.client.get('/api/quizzes/?search=Basics')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class QuestionViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.level = Level.objects.create(name='A1', code='A1', order=1)
        self.quiz = Quiz.objects.create(
            title='Q1', description='Desc',
            level=self.level, order=1
        )
        self.question = Question.objects.create(
            quiz=self.quiz,
            question_text='Test?',
            options={'a': 'A', 'b': 'B'},
            correct_answer='a',
            order=1,
        )

    def test_list_questions(self):
        response = self.client.get('/api/questions/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)

    def test_filter_by_quiz(self):
        response = self.client.get(f'/api/questions/?quiz={self.quiz.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_create_question(self):
        self.client.force_authenticate(user=Account.objects.create_user(
            username='q_user2', email='q2@t.com', password='pass123'
        ))
        data = {
            'quiz': self.quiz.id,
            'question_text': 'New question?',
            'options': {'a': '1', 'b': '2', 'c': '3', 'd': '4'},
            'correct_answer': 'a',
            'order': 2,
        }
        response = self.client.post('/api/questions/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class UserQuizAttemptViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = Account.objects.create_user(
            username='attempt_user', email='au@t.com', password='pass123'
        )
        self.level = Level.objects.create(name='A1', code='A1', order=1)
        self.quiz = Quiz.objects.create(
            title='Attempt Quiz', description='Desc',
            level=self.level, order=1, questions_count=2
        )
        Question.objects.create(
            quiz=self.quiz, question_text='Q1?',
            options={'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D'},
            correct_answer='a', order=1, points=1
        )
        Question.objects.create(
            quiz=self.quiz, question_text='Q2?',
            options={'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D'},
            correct_answer='b', order=2, points=1
        )
        self.attempt = UserQuizAttempt.objects.create(
            user=self.user, quiz=self.quiz,
            score=1, max_score=2, percentage=50.0,
            time_taken=120, is_completed=True
        )

    def test_list_attempts(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/quiz-attempts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)

    def test_create_attempt(self):
        self.client.force_authenticate(user=self.user)
        quiz2 = Quiz.objects.create(
            title='New Quiz', description='Desc',
            level=self.level, order=2, questions_count=1
        )
        data = {
            'quiz': quiz2.id,
            'score': 1,
            'max_score': 1,
            'percentage': 100.0,
            'passed': True,
            'time_taken': 60,
            'is_completed': True,
        }
        response = self.client.post('/api/quiz-attempts/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_score_breakdown_in_response(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/quiz-attempts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data['results']
        self.assertGreater(len(results), 0)
        self.assertIn('score_breakdown', results[0])
        self.assertIn('percentage', results[0]['score_breakdown'])

    def test_other_user_cannot_access(self):
        other_user = Account.objects.create_user(
            username='other', email='o@t.com', password='pass123'
        )
        self.client.force_authenticate(user=other_user)
        response = self.client.get('/api/quiz-attempts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 0)
