from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from common.models import Level
from flashcard.models import Flashcard, FlashcardDeck, UserFlashcardProgress

Account = get_user_model()


class FlashcardAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = Account.objects.create_user(
            username='fc_user', email='fc@t.com', password='pass12345'
        )
        self.other = Account.objects.create_user(
            username='fc_other', email='other@t.com', password='pass12345'
        )
        self.level = Level.objects.create(name='A1', code='A1', order=1)
        self.client.force_authenticate(user=self.user)
        self.deck = FlashcardDeck.objects.create(
            name='Core verbs',
            description='common verbs',
            owner=self.user,
            level=self.level,
        )
        self.card = Flashcard.objects.create(
            deck=self.deck, front='go', back='đi', order=0
        )

    def test_card_count_uses_flashcards_related_name(self):
        self.assertEqual(self.deck.flashcards.count(), 1)

    def test_list_my_decks_returns_card_count(self):
        response = self.client.get('/api/flashcard-decks/my_decks/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', response.data)
        self.assertEqual(results[0]['card_count'], 1)
        self.assertEqual(results[0]['name'], 'Core verbs')

    def test_create_deck(self):
        response = self.client.post(
            '/api/flashcard-decks/',
            {'name': 'Adjectives', 'description': 'adj'},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['owner'], self.user.id)

    def test_add_cards_action(self):
        response = self.client.post(
            f'/api/flashcard-decks/{self.deck.id}/add_cards/',
            {'cards': [{'front': 'eat', 'back': 'ăn'}, {'front': 'see', 'back': 'nhìn'}]},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.deck.flashcards.count(), 3)

    def test_add_cards_requires_payload(self):
        response = self.client.post(
            f'/api/flashcard-decks/{self.deck.id}/add_cards/',
            {},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_remove_cards_action(self):
        response = self.client.delete(
            f'/api/flashcard-decks/{self.deck.id}/remove_cards/',
            {'card_ids': [self.card.id]},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.deck.flashcards.count(), 0)

    def test_private_deck_hidden_from_other_user(self):
        self.client.force_authenticate(user=self.other)
        response = self.client.get(f'/api/flashcard-decks/{self.deck.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_public_decks_action(self):
        self.deck.is_public = True
        self.deck.save()
        self.client.force_authenticate(user=self.other)
        response = self.client.get('/api/flashcard-decks/public_decks/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', response.data)
        names = [d['name'] for d in results]
        self.assertIn('Core verbs', names)

    def test_list_cards_by_deck_id(self):
        response = self.client.get(f'/api/flashcards/?deck_id={self.deck.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', response.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['front'], 'go')

    def test_bulk_create_progress_and_review(self):
        response = self.client.post(
            '/api/flashcard-progress/bulk_create_progress/',
            {'deck_id': self.deck.id},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']), 1)
        progress_id = response.data['data'][0]['id']

        review = self.client.post(
            f'/api/flashcard-progress/{progress_id}/review/',
            {'is_correct': True},
            format='json',
        )
        self.assertEqual(review.status_code, status.HTTP_200_OK)
        self.assertEqual(review.data['data']['mastery_level'], 1)
        self.assertEqual(review.data['data']['correct_count'], 1)
        self.assertEqual(review.data['data']['accuracy'], 100.0)

        stats = self.client.get('/api/flashcard-progress/statistics/')
        self.assertEqual(stats.status_code, status.HTTP_200_OK)
        self.assertEqual(stats.data['data']['total_cards'], 1)
        self.assertEqual(stats.data['data']['learning'], 1)

        due = self.client.get('/api/flashcard-progress/due_for_review/')
        self.assertEqual(due.status_code, status.HTTP_200_OK)

    def test_unauthenticated_denied(self):
        self.client.force_authenticate(user=None)
        response = self.client.get('/api/flashcard-decks/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
