from django.shortcuts import render
from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count, Avg
from django.utils import timezone
from datetime import timedelta
from common.mixins import StandardResultsSetPagination
from .models import FlashcardDeck, Flashcard, UserFlashcardProgress
from .serializers import (
    FlashcardDeckSerializer, FlashcardDeckDetailSerializer,
    FlashcardSerializer, UserFlashcardProgressSerializer
)


class FlashcardDeckViewSet(viewsets.ModelViewSet):
    serializer_class = FlashcardDeckSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at', 'card_count']
    ordering = ['-created_at']
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return FlashcardDeck.objects.filter(
            Q(owner=self.request.user) | Q(is_public=True)
        ).select_related('level', 'owner').prefetch_related('topics').annotate(
            card_count=Count('flashcards')
        ).order_by('-created_at')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return FlashcardDeckDetailSerializer
        return FlashcardDeckSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['POST'])
    def add_cards(self, request, pk=None):
        """Add multiple cards to a deck"""
        deck = self.get_object()
        cards_data = request.data.get('cards', [])

        if not cards_data:
            return Response({'error': 'cards array is required'}, status=400)

        cards = []
        for idx, card_data in enumerate(cards_data):
            cards.append(Flashcard(
                deck=deck,
                front=card_data.get('front', ''),
                back=card_data.get('back', ''),
                part_of_speech=card_data.get('part_of_speech', ''),
                example_sentence=card_data.get('example_sentence', ''),
                difficulty=card_data.get('difficulty', 1),
                order=card_data.get('order', idx)
            ))

        Flashcard.objects.bulk_create(cards)
        return Response({'status': f'{len(cards)} cards added'})

    @action(detail=True, methods=['DELETE'])
    def remove_cards(self, request, pk=None):
        """Remove cards from a deck by IDs"""
        deck = self.get_object()
        card_ids = request.data.get('card_ids', [])

        if not card_ids:
            return Response({'error': 'card_ids is required'}, status=400)

        deleted_count, _ = Flashcard.objects.filter(deck=deck, id__in=card_ids).delete()
        return Response({'status': f'{deleted_count} cards removed'})

    @action(detail=False, methods=['GET'])
    def my_decks(self, request):
        """Get only the current user's decks"""
        queryset = self.get_queryset().filter(owner=request.user)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'])
    def public_decks(self, request):
        """Get public decks"""
        queryset = FlashcardDeck.objects.filter(is_public=True).select_related(
            'level', 'owner'
        ).prefetch_related('topics').annotate(
            card_count=Count('flashcards')
        ).order_by('-created_at')
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'])
    def favorites(self, request):
        """Get user's favorite decks"""
        queryset = self.get_queryset().filter(owner=request.user, is_favorite=True)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class FlashcardViewSet(viewsets.ModelViewSet):
    serializer_class = FlashcardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Flashcard.objects.select_related('deck')
        deck_id = self.request.query_params.get('deck_id')
        if deck_id:
            return qs.filter(deck_id=deck_id)
        return qs.none()


class UserFlashcardProgressViewSet(viewsets.ModelViewSet):
    serializer_class = UserFlashcardProgressSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return UserFlashcardProgress.objects.filter(user=self.request.user).select_related(
            'flashcard', 'flashcard__deck'
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['GET'])
    def due_for_review(self, request):
        """Get flashcards due for review (spaced repetition)"""
        queryset = self.get_queryset().filter(
            Q(next_review__lte=timezone.now()) | Q(next_review__isnull=True)
        ).select_related('flashcard')
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'])
    def statistics(self, request):
        """Get flashcard learning statistics"""
        queryset = self.get_queryset()
        total_cards = queryset.count()
        mastered = queryset.filter(mastery_level=5).count()
        learning = queryset.filter(mastery_level__gt=0, mastery_level__lt=5).count()
        new_cards = queryset.filter(mastery_level=0).count()
        due_count = queryset.filter(
            Q(next_review__lte=timezone.now()) | Q(next_review__isnull=True)
        ).count()
        avg_mastery = queryset.aggregate(avg=Avg('mastery_level'))['avg'] or 0
        total_reviews = queryset.aggregate(total=Count('id'))['total'] or 0

        return Response({
            'total_cards': total_cards,
            'mastered': mastered,
            'learning': learning,
            'new_cards': new_cards,
            'due_for_review': due_count,
            'average_mastery': round(avg_mastery, 2),
            'total_reviews': total_reviews,
        })

    @action(detail=True, methods=['POST'])
    def review(self, request, pk=None):
        """Record a review for a flashcard (spaced repetition)"""
        progress = self.get_object()
        is_correct = request.data.get('is_correct', False)

        progress.review_count += 1
        if is_correct:
            progress.correct_count += 1
            progress.mastery_level = min(5, progress.mastery_level + 1)
        else:
            progress.mastery_level = max(0, progress.mastery_level - 1)

        progress.last_reviewed = timezone.now()
        # Spaced repetition: interval doubles with each mastery level
        interval = 2 ** max(progress.mastery_level, 1)
        progress.next_review = timezone.now() + timedelta(days=interval)
        progress.save()

        serializer = self.get_serializer(progress)
        return Response(serializer.data)

    @action(detail=False, methods=['POST'])
    def bulk_create_progress(self, request):
        """Create progress entries for all cards in a deck"""
        deck_id = request.data.get('deck_id')
        if not deck_id:
            return Response({'error': 'deck_id is required'}, status=400)

        cards = Flashcard.objects.filter(deck_id=deck_id)
        user = request.user
        created = []

        for card in cards:
            progress, created_new = UserFlashcardProgress.objects.get_or_create(
                user=user,
                flashcard=card,
                defaults={'mastery_level': 0}
            )
            created.append(progress)

        serializer = self.get_serializer(created, many=True)
        return Response(serializer.data)
