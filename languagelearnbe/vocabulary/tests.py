from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from common.models import Level, Topic
from vocabulary.models import Vocabulary, VocabularyList, UserVocabulary

Account = get_user_model()


class VocabularyViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = Account.objects.create_user(
            username='vocab_user', email='v@t.com', password='pass123'
        )
        self.level = Level.objects.create(name='A1', code='A1', order=1)
        self.topic = Topic.objects.create(name='Greetings', order=1)
        self.vocab = Vocabulary.objects.create(
            word='hello', meaning='xin chào', level=self.level,
            part_of_speech='noun'
        )
        self.vocab.topics.add(self.topic)

    def test_retrieve_vocabulary(self):
        response = self.client.get(f'/api/vocabulary/{self.vocab.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['word'], 'hello')
        self.assertIn('level_details', response.data)
        self.assertIn('topics_details', response.data)

    def test_create_vocabulary_as_anon(self):
        data = {'word': 'world', 'meaning': 'thế giới', 'level': self.level.id}
        response = self.client.post('/api/vocabulary/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_vocabulary_as_user(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'word': 'world', 'meaning': 'thế giới',
            'level': self.level.id,
            'topics': [self.topic.id],
            'part_of_speech': 'noun',
        }
        response = self.client.post('/api/vocabulary/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Vocabulary.objects.count(), 2)

    def test_by_topic_action(self):
        response = self.client.get(f'/api/vocabulary/by_topic/?topic_id={self.topic.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)

    def test_by_topic_missing_param(self):
        response = self.client.get('/api/vocabulary/by_topic/')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_by_level_action(self):
        response = self.client.get(f'/api/vocabulary/by_level/?level_id={self.level.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)

    def test_related_words_action(self):
        # Create synonyms
        vocab2 = Vocabulary.objects.create(word='hi', meaning='chào', level=self.level)
        self.vocab.synonyms.add(vocab2)
        response = self.client.get(f'/api/vocabulary/{self.vocab.id}/related_words/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('synonyms', response.data)
        self.assertIn('antonyms', response.data)

    def test_search_vocabulary(self):
        response = self.client.get('/api/vocabulary/?search=hello')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)

    def test_pagination(self):
        # Create 25 vocabularies
        for i in range(25):
            Vocabulary.objects.create(
                word=f'word{i}', meaning=f'meaning{i}', level=self.level
            )
        response = self.client.get('/api/vocabulary/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('page', response.data)
        self.assertLessEqual(len(response.data['results']), 20)
        self.assertTrue(response.data['total_pages'] >= 2)


class VocabularyListViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = Account.objects.create_user(
            username='list_user', email='l@t.com', password='pass123'
        )
        self.vocab = Vocabulary.objects.create(
            word='cat', meaning='mèo', level=Level.objects.create(name='A1', code='A1', order=1)
        )
        self.vocab_list = VocabularyList.objects.create(
            name='Animals', owner=self.user, is_public=False
        )
        self.vocab_list.words.add(self.vocab)

    def test_list_own_lists(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/vocabulary-lists/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)

    def test_create_list(self):
        self.client.force_authenticate(user=self.user)
        data = {'name': 'Food', 'is_public': True}
        response = self.client.post('/api/vocabulary-lists/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(VocabularyList.objects.filter(owner=self.user).count(), 2)

    def test_public_lists_visible_to_anon(self):
        public_list = VocabularyList.objects.create(
            name='Public', owner=self.user, is_public=True
        )
        response = self.client.get('/api/vocabulary-lists/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        names = [r['name'] for r in response.data['results']]
        self.assertIn('Public', names)

    def test_add_words_action(self):
        level2 = Level.objects.create(name='B1', code='B1', order=2)
        vocab2 = Vocabulary.objects.create(
            word='dog', meaning='chó', level=level2
        )
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            f'/api/vocabulary-lists/{self.vocab_list.id}/add_words/',
            {'word_ids': [vocab2.id]}, format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.vocab_list.refresh_from_db()
        self.assertEqual(self.vocab_list.words.count(), 2)

    def test_add_words_missing_param(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            f'/api/vocabulary-lists/{self.vocab_list.id}/add_words/',
            {}, format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserVocabularyViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = Account.objects.create_user(
            username='uv_user', email='u@t.com', password='pass123'
        )
        self.vocab = Vocabulary.objects.create(
            word='book', meaning='sách', level=Level.objects.create(name='A1', code='A1', order=1)
        )
        self.user_vocab = UserVocabulary.objects.create(
            user=self.user, vocabulary=self.vocab, mastery_level=3
        )

    def test_list_user_vocabularies(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/user-vocabulary/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        self.assertEqual(len(response.data['results']), 1)

    def test_statistics_action(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/user-vocabulary/statistics/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        self.assertIn('total_words', data)
        self.assertIn('mastered_words', data)
        self.assertEqual(data['total_words'], 1)

    def test_due_for_review_action(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/user-vocabulary/due_for_review/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_review_action_correct(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            f'/api/user-vocabulary/{self.user_vocab.id}/review/',
            {'is_correct': True}, format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user_vocab.refresh_from_db()
        self.assertEqual(self.user_vocab.mastery_level, 4)
        self.assertIsNotNone(self.user_vocab.next_review)

    def test_review_action_incorrect(self):
        self.client.force_authenticate(user=self.user)
        initial_level = self.user_vocab.mastery_level
        response = self.client.post(
            f'/api/user-vocabulary/{self.user_vocab.id}/review/',
            {'is_correct': False}, format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user_vocab.refresh_from_db()
        self.assertEqual(self.user_vocab.mastery_level, initial_level - 1)
        self.assertEqual(self.user_vocab.review_count, 1)

    def test_other_user_cannot_access(self):
        other_user = Account.objects.create_user(
            username='other', email='o@t.com', password='pass123'
        )
        self.client.force_authenticate(user=other_user)
        response = self.client.get('/api/user-vocabulary/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 0)
