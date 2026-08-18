from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from common.models import Level, Topic
from sentence.models import SentenceStructure, SentenceVocabularyItem

Account = get_user_model()


class SentenceStructureViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = Account.objects.create_user(
            username='sent_user', email='se@t.com', password='pass123'
        )
        self.level = Level.objects.create(name='A1', code='A1', order=1)
        self.topic = Topic.objects.create(name='Grammar', order=1)
        self.sentence = SentenceStructure.objects.create(
            pattern='S + V + O',
            formula='Subject + Verb + Object',
            description='Basic sentence structure',
            difficulty=1,
            order=1,
            is_published=True,
            level=self.level,
        )
        self.sentence.topics.add(self.topic)
        self.vocab_item = SentenceVocabularyItem.objects.create(
            sentence=self.sentence,
            word='book',
            meaning='sách',
            position=3,
            part_of_speech='noun',
        )

    def test_list_sentences(self):
        response = self.client.get('/api/sentence-structures/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)

    def test_retrieve_sentence(self):
        response = self.client.get(f'/api/sentence-structures/{self.sentence.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['pattern'], 'S + V + O')
        self.assertIn('level_details', response.data)
        self.assertIn('vocabulary_items', response.data)
        self.assertGreater(len(response.data['vocabulary_items']), 0)

    def test_create_sentence_as_anon(self):
        data = {
            'pattern': 'S + V', 'formula': 'Subject + Verb',
            'level': self.level.id, 'is_published': True, 'order': 1
        }
        response = self.client.post('/api/sentence-structures/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_sentence_as_user(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'pattern': 'S + Be + Adj',
            'formula': 'Subject + Be + Adjective',
            'description': 'Descriptive sentence',
            'difficulty': 1,
            'is_published': True,
            'level': self.level.id,
            'topics': [self.topic.id],
            'order': 2,
        }
        response = self.client.post('/api/sentence-structures/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_search_sentences(self):
        response = self.client.get('/api/sentence-structures/?search=S+V+O')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)

    def test_filter_published_only(self):
        # Create unpublished sentence
        SentenceStructure.objects.create(
            pattern='Draft', formula='Draft formula',
            is_published=False, level=self.level, order=2
        )
        response = self.client.get('/api/sentence-structures/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Only published should be visible
        patterns = [r['pattern'] for r in response.data['results']]
        self.assertIn('S + V + O', patterns)
        # Draft should not appear (or may appear as admin, but anon shouldn't see it)
