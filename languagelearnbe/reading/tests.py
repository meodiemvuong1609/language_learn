from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from common.models import Level, Topic
from reading.models import (
    ReadingLesson, ReadingParagraph, ReadingComprehension, UserReadingProgress
)
from vocabulary.models import Vocabulary

Account = get_user_model()


class ReadingLessonViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = Account.objects.create_user(
            username='read_user', email='r@t.com', password='pass123'
        )
        self.level = Level.objects.create(name='A1', code='A1', order=1)
        self.topic = Topic.objects.create(name='Stories', order=1)
        self.lesson = ReadingLesson.objects.create(
            title='The Cat and the Moon',
            description='A short story',
            content='Once upon a time...',
            word_count=50,
            estimated_duration=5,
            level=self.level,
            order=1,
            is_published=True,
        )
        self.lesson.topics.add(self.topic)

    def test_list_lessons(self):
        response = self.client.get('/api/reading-lessons/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)

    def test_retrieve_lesson(self):
        response = self.client.get(f'/api/reading-lessons/{self.lesson.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'The Cat and the Moon')
        self.assertIn('level_details', response.data)

    def test_create_lesson_as_anon(self):
        data = {
            'title': 'New Story',
            'content': 'Once...',
            'word_count': 30,
            'level': self.level.id,
            'order': 2,
        }
        response = self.client.post('/api/reading-lessons/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_lesson_as_user(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'title': 'My Story',
            'content': 'Once...',
            'word_count': 30,
            'level': self.level.id,
            'order': 2,
            'topics': [self.topic.id],
        }
        response = self.client.post('/api/reading-lessons/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_search_lessons(self):
        response = self.client.get('/api/reading-lessons/?search=Cat')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)

    def test_filter_published_only(self):
        ReadingLesson.objects.create(
            title='Draft', content='Draft content',
            word_count=10, level=self.level, order=2, is_published=False
        )
        response = self.client.get('/api/reading-lessons/')
        results = response.data['results']
        titles = [r['title'] for r in results]
        self.assertIn('The Cat and the Moon', titles)


class ReadingParagraphViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.level = Level.objects.create(name='A1', code='A1', order=1)
        self.topic = Topic.objects.create(name='Stories', order=1)
        self.lesson = ReadingLesson.objects.create(
            title='Story', description='Desc',
            content='Full content',
            word_count=20, level=self.level, order=1
        )
        self.paragraph = ReadingParagraph.objects.create(
            lesson=self.lesson,
            content='First paragraph',
            order=1,
            translation='Đoạn đầu tiên',
        )
        self.vocab = Vocabulary.objects.create(
            word='story', meaning='câu chuyện', level=self.level
        )
        self.paragraph.vocabulary_items.add(self.vocab)

    def test_list_paragraphs(self):
        response = self.client.get('/api/reading-paragraphs/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)

    def test_filter_by_lesson(self):
        response = self.client.get(
            f'/api/reading-paragraphs/?lesson={self.lesson.id}'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_paragraph_includes_vocab(self):
        response = self.client.get(f'/api/reading-paragraphs/{self.paragraph.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('vocabulary_items', response.data)
        self.assertGreater(len(response.data['vocabulary_items']), 0)


class ReadingComprehensionViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.level = Level.objects.create(name='A1', code='A1', order=1)
        self.lesson = ReadingLesson.objects.create(
            title='Comprehension Test', description='Desc',
            content='Full content',
            word_count=100, level=self.level, order=1
        )
        self.question = ReadingComprehension.objects.create(
            lesson=self.lesson,
            question_text='What is the story about?',
            options={'a': 'A cat', 'b': 'A dog', 'c': 'A bird', 'd': 'A fish'},
            correct_answer='a',
            explanation='The title says "The Cat and the Moon"',
            order=1,
            difficulty=1,
        )

    def test_list_questions(self):
        response = self.client.get('/api/reading-comprehension/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)

    def test_create_question(self):
        self.client.force_authenticate(user=Account.objects.create_user(
            username='q_user', email='q@t.com', password='pass123'
        ))
        data = {
            'lesson': self.lesson.id,
            'question_text': 'New question?',
            'options': {'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D'},
            'correct_answer': 'a',
            'order': 2,
        }
        response = self.client.post('/api/reading-comprehension/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class UserReadingProgressViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = Account.objects.create_user(
            username='rp_user', email='rp@t.com', password='pass123'
        )
        self.level = Level.objects.create(name='A1', code='A1', order=1)
        self.lesson = ReadingLesson.objects.create(
            title='Progress Test', description='Desc',
            content='Content',
            word_count=50, level=self.level, order=1
        )
        self.progress = UserReadingProgress.objects.create(
            user=self.user, lesson=self.lesson,
            started=True, completed=False,
            completed_paragraphs=2, score=75.0
        )

    def test_list_progress(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/reading-progress/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)

    def test_create_progress(self):
        self.client.force_authenticate(user=self.user)
        lesson2 = ReadingLesson.objects.create(
            title='Lesson 2', description='Desc',
            content='Content 2', word_count=30,
            level=self.level, order=2
        )
        data = {'lesson': lesson2.id, 'started': True}
        response = self.client.post('/api/reading-progress/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_other_user_cannot_access(self):
        other_user = Account.objects.create_user(
            username='other', email='o@t.com', password='pass123'
        )
        self.client.force_authenticate(user=other_user)
        response = self.client.get('/api/reading-progress/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 0)
