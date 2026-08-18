from django.shortcuts import render
from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count, Avg
from django.utils import timezone
from common.mixins import StandardResultsSetPagination
from general.general import convert_response
from .models import Vocabulary, VocabularyList, VocabularyListItem, UserVocabulary
from .serializers import (
    VocabularySerializer, VocabularyListSerializer,
    VocabularyListItemSerializer, UserVocabularySerializer
)

# Create your views here.

class VocabularyViewSet(viewsets.ModelViewSet):
    queryset = Vocabulary.objects.select_related('level').prefetch_related('topics', 'synonyms', 'antonyms')
    serializer_class = VocabularySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['word', 'meaning', 'example_sentence']
    ordering_fields = ['word', 'created_at']
    ordering = ['word']
    pagination_class = StandardResultsSetPagination

    @action(detail=False, methods=['GET'])
    def by_topic(self, request):
        """Get vocabularies filtered by topic"""
        topic_id = request.query_params.get('topic_id')
        if topic_id:
            queryset = self.get_queryset().filter(topics__id=topic_id)
            serializer = self.get_serializer(queryset, many=True)
            return Response(
                convert_response(
                    message='Vocabularies retrieved successfully',
                    status_code=status.HTTP_200_OK,
                    data=serializer.data,
                    count=len(serializer.data)
                ),
                status=status.HTTP_200_OK
            )
        return Response(
            convert_response(
                message='topic_id is required',
                status_code=status.HTTP_400_BAD_REQUEST
            ),
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=False, methods=['GET'])
    def by_level(self, request):
        """Get vocabularies filtered by level"""
        level_id = request.query_params.get('level_id')
        if level_id:
            queryset = self.get_queryset().filter(level_id=level_id)
            serializer = self.get_serializer(queryset, many=True)
            return Response(
                convert_response(
                    message='Vocabularies retrieved successfully',
                    status_code=status.HTTP_200_OK,
                    data=serializer.data,
                    count=len(serializer.data)
                ),
                status=status.HTTP_200_OK
            )
        return Response(
            convert_response(
                message='level_id is required',
                status_code=status.HTTP_400_BAD_REQUEST
            ),
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=True, methods=['GET'])
    def related_words(self, request, pk=None):
        """Get synonyms and antonyms for a word"""
        vocabulary = self.get_object()
        data = {
            'synonyms': VocabularySerializer(vocabulary.synonyms, many=True).data,
            'antonyms': VocabularySerializer(vocabulary.antonyms, many=True).data
        }
        return Response(
            convert_response(
                message='Related words retrieved successfully',
                status_code=status.HTTP_200_OK,
                data=data,
                count=len(data['synonyms']) + len(data['antonyms'])
            ),
            status=status.HTTP_200_OK
        )

class VocabularyListViewSet(viewsets.ModelViewSet):
    serializer_class = VocabularyListSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return VocabularyList.objects.filter(
                Q(owner=self.request.user) | Q(is_public=True)
            )
        return VocabularyList.objects.filter(is_public=True)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['POST'])
    def add_words(self, request, pk=None):
        """Add words to vocabulary list"""
        vocab_list = self.get_object()
        word_ids = request.data.get('word_ids', [])

        if not word_ids:
            return Response({'error': 'word_ids is required'}, status=400)

        items = []
        order = VocabularyListItem.objects.filter(vocabulary_list=vocab_list).count()

        for word_id in word_ids:
            order += 1
            items.append(VocabularyListItem(
                vocabulary_list=vocab_list,
                vocabulary_id=word_id,
                order=order
            ))

        VocabularyListItem.objects.bulk_create(items)
        return Response({'status': 'words added'})

    @action(detail=True, methods=['POST'])
    def remove_words(self, request, pk=None):
        """Remove words from vocabulary list"""
        vocab_list = self.get_object()
        word_ids = request.data.get('word_ids', [])

        if not word_ids:
            return Response({'error': 'word_ids is required'}, status=400)

        VocabularyListItem.objects.filter(
            vocabulary_list=vocab_list,
            vocabulary_id__in=word_ids
        ).delete()

        return Response({'status': 'words removed'})

class UserVocabularyViewSet(viewsets.ModelViewSet):
    serializer_class = UserVocabularySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['mastery_level', 'last_reviewed', 'next_review']
    ordering = ['-last_reviewed']

    def get_queryset(self):
        return UserVocabulary.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['GET'])
    def due_for_review(self, request):
        """Get words that are due for review"""
        queryset = self.get_queryset().filter(
            Q(next_review__lte=timezone.now()) | Q(next_review__isnull=True)
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(
            convert_response(
                message='Words due for review retrieved successfully',
                status_code=status.HTTP_200_OK,
                data=serializer.data,
                count=len(serializer.data)
            ),
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['GET'])
    def statistics(self, request):
        """Get vocabulary learning statistics"""
        queryset = self.get_queryset()
        total_words = queryset.count()
        mastered_words = queryset.filter(mastery_level=5).count()
        learning_words = queryset.filter(mastery_level__gt=0, mastery_level__lt=5).count()
        average_mastery = queryset.aggregate(avg=Avg('mastery_level'))['avg'] or 0

        data = {
            'total_words': total_words,
            'mastered_words': mastered_words,
            'learning_words': learning_words,
            'new_words': total_words - mastered_words - learning_words,
            'average_mastery': round(average_mastery, 2)
        }
        return Response(
            convert_response(
                message='Vocabulary statistics retrieved successfully',
                status_code=status.HTTP_200_OK,
                data=data,
                count=total_words
            ),
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['POST'])
    def review(self, request, pk=None):
        """Record a review attempt for a word"""
        user_vocab = self.get_object()
        is_correct = request.data.get('is_correct', False)

        user_vocab.review_count += 1
        if is_correct:
            user_vocab.correct_count += 1
            user_vocab.mastery_level = min(5, user_vocab.mastery_level + 1)
        else:
            user_vocab.mastery_level = max(0, user_vocab.mastery_level - 1)

        user_vocab.last_reviewed = timezone.now()
        # Calculate next review based on spaced repetition algorithm
        interval = 2 ** user_vocab.mastery_level  # days
        user_vocab.next_review = timezone.now() + timezone.timedelta(days=interval)
        user_vocab.save()

        serializer = self.get_serializer(user_vocab)
        return Response(
            convert_response(
                message='Review recorded successfully',
                status_code=status.HTTP_200_OK,
                data=serializer.data
            ),
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['POST'])
    def review_word(self, request):
        vocab_id = request.data.get('vocabulary_id')
        is_correct = request.data.get('is_correct', False)
        if not vocab_id:
            return Response(
                convert_response(
                    message='vocabulary_id is required',
                    status_code=status.HTTP_400_BAD_REQUEST
                ),
                status=status.HTTP_400_BAD_REQUEST
            )
        user_vocab, _ = UserVocabulary.objects.get_or_create(
            user=request.user, vocabulary_id=vocab_id
        )
        user_vocab.review_count += 1
        if is_correct:
            user_vocab.correct_count += 1
            user_vocab.mastery_level = min(5, user_vocab.mastery_level + 1)
        else:
            user_vocab.mastery_level = max(0, user_vocab.mastery_level - 1)
        user_vocab.last_reviewed = timezone.now()
        interval = 2 ** user_vocab.mastery_level
        user_vocab.next_review = timezone.now() + timezone.timedelta(days=interval)
        user_vocab.save()
        serializer = self.get_serializer(user_vocab)
        return Response(
            convert_response(
                message='Review recorded successfully',
                status_code=status.HTTP_200_OK,
                data=serializer.data
            ),
            status=status.HTTP_200_OK
        )
