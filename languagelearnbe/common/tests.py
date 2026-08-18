from django.test import TestCase, SimpleTestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.db.models.signals import pre_save
from rest_framework.test import APIClient
from rest_framework import status

from account.middleware import _thread_locals
from common.models import Level, Topic
from common.signals import set_created_updated_by
from vocabulary.models import Vocabulary

Account = get_user_model()


class CreatedUpdatedBySignalTest(SimpleTestCase):
    """Regression test for the BaseModel created_by/updated_by signal.

    Runs without touching the DB: it exercises the pre_save receiver directly
    against unsaved model instances, which is enough to prove the signal reads
    the current user from the middleware thread-local (previously it always
    read None from a throwaway threading.local()).
    """

    def tearDown(self):
        _thread_locals.user = None

    def test_populates_for_authenticated_user_on_basemodel(self):
        user = Account(pk=42, username='tester')
        _thread_locals.user = user

        vocab = Vocabulary(word='hello')  # unsaved -> _state.adding is True
        pre_save.send(sender=Vocabulary, instance=vocab)

        self.assertEqual(vocab.created_by_id, 42)
        self.assertEqual(vocab.updated_by_id, 42)

    def test_noop_for_anonymous_user(self):
        _thread_locals.user = None

        vocab = Vocabulary(word='world')
        pre_save.send(sender=Vocabulary, instance=vocab)

        self.assertIsNone(vocab.created_by_id)
        self.assertIsNone(vocab.updated_by_id)

    def test_skips_non_basemodel_instances(self):
        user = Account(pk=7, username='tester2')
        _thread_locals.user = user

        # Level is a plain models.Model (not BaseModel) and has no such fields.
        level = Level(name='A1', code='A1', order=1)
        pre_save.send(sender=Level, instance=level)

        self.assertFalse(hasattr(level, 'created_by'))

    def test_signal_is_connected(self):
        # receiver entries are (lookup_key, receiver_ref, ...) and the tuple
        # shape varies across Django versions, so index defensively.
        registered = any(
            entry[1]() is set_created_updated_by for entry in pre_save.receivers
        )
        self.assertTrue(registered)


class LevelViewSetTest(TestCase):
    """Test Level CRUD operations."""

    def setUp(self):
        self.client = APIClient()
        self.admin = Account.objects.create_superuser(
            username='admin',
            email='admin@test.com',
            password='adminpass123',
        )
        self.level = Level.objects.create(
            name='Beginner',
            code='A1',
            description='Beginner level',
            order=1,
        )

    def test_list_levels(self):
        response = self.client.get('/api/levels/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        self.assertEqual(response.data['results'][0]['name'], 'Beginner')

    def test_create_level_as_admin(self):
        self.client.force_authenticate(user=self.admin)
        data = {'name': 'Intermediate', 'code': 'A2', 'description': 'Intermediate'}
        response = self.client.post('/api/levels/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Level.objects.count(), 2)

    def test_create_level_as_anon(self):
        data = {'name': 'Hacker', 'code': 'X1'}
        response = self.client.post('/api/levels/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrieve_level(self):
        response = self.client.get(f'/api/levels/{self.level.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['code'], 'A1')

    def test_update_level_as_admin(self):
        self.client.force_authenticate(user=self.admin)
        data = {'name': 'Beginner Updated', 'code': 'A1'}
        response = self.client.put(f'/api/levels/{self.level.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.level.refresh_from_db()
        self.assertEqual(self.level.name, 'Beginner Updated')

    def test_delete_level_as_admin(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(f'/api/levels/{self.level.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Level.objects.count(), 0)


class TopicViewSetTest(TestCase):
    """Test Topic CRUD operations."""

    def setUp(self):
        self.client = APIClient()
        self.admin = Account.objects.create_superuser(
            username='admin2', email='admin2@test.com', password='pass123'
        )
        self.parent_topic = Topic.objects.create(
            name='Technology', description='Tech topics', order=1
        )
        self.child_topic = Topic.objects.create(
            name='AI', description='Artificial Intelligence',
            order=1, parent=self.parent_topic
        )

    def test_list_topics(self):
        response = self.client.get('/api/topics/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)

    def test_root_topics_action(self):
        response = self.client.get('/api/topics/root_topics/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['code'], status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']), 1)
        self.assertEqual(response.data['data'][0]['name'], 'Technology')
        self.assertEqual(response.data['count'], 1)

    def test_subtopics_action(self):
        response = self.client.get(f'/api/topics/{self.parent_topic.id}/subtopics/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['code'], status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']), 1)
        self.assertEqual(response.data['data'][0]['name'], 'AI')
        self.assertEqual(response.data['count'], 1)

    def test_create_topic_as_admin(self):
        self.client.force_authenticate(user=self.admin)
        data = {'name': 'Science', 'description': 'Science topics', 'order': 2}
        response = self.client.post('/api/topics/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_search_topics(self):
        response = self.client.get('/api/topics/?search=Tech')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)


class VocabularyWithLevelAndTopicTest(TestCase):
    """Test integration: Vocabulary + Level + Topic."""

    def setUp(self):
        self.client = APIClient()
        self.user = Account.objects.create_user(
            username='vuser', email='v@test.com', password='pass123'
        )
        self.level = Level.objects.create(name='A1', code='A1', order=1)
        self.topic = Topic.objects.create(name='Food', order=1)
        self.vocab = Vocabulary.objects.create(
            word='apple',
            meaning='quả táo',
            level=self.level,
        )
        self.vocab.topics.add(self.topic)

    def test_vocabulary_list_includes_level_and_topic(self):
        response = self.client.get('/api/vocabulary/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data['results']
        self.assertGreater(len(results), 0)
        item = results[0]
        self.assertIn('level_details', item)
        self.assertIn('topics_details', item)
        self.assertEqual(item['level_details']['code'], 'A1')
