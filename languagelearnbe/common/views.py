import os
from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings
from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from django.contrib.contenttypes.models import ContentType
from common.mixins import StandardResultsSetPagination
from .models import Level, Topic, Progress, UserPreference
from .serializers import (
    LevelSerializer, TopicSerializer,
    ProgressSerializer, UserPreferenceSerializer
)


class LevelViewSet(viewsets.ModelViewSet):
    queryset = Level.objects.all()
    serializer_class = LevelSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['order', 'name']
    ordering = ['order']
    pagination_class = StandardResultsSetPagination


class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['order', 'name']
    ordering = ['order']
    pagination_class = StandardResultsSetPagination

    @action(detail=False, methods=['get'], url_path='root_topics')
    def root_topics(self, request):
        """Return topics without a parent (root topics only)."""
        qs = Topic.objects.filter(parent__isnull=True)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], url_path='subtopics')
    def subtopics(self, request, pk=None):
        """Return direct children of the given topic."""
        topic = self.get_object()
        qs = Topic.objects.filter(parent=topic)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class ProgressViewSet(viewsets.ModelViewSet):
    serializer_class = ProgressSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['last_reviewed', 'next_review', 'score']
    ordering = ['-last_reviewed']
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return Progress.objects.filter(user=self.request.user).select_related('user', 'content_type')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], url_path='dashboard-stats')
    def dashboard_stats(self, request):
        """
        Returns aggregated dashboard statistics for the current user:
        - counts by content_type model (vocabulary, listening, speaking, quiz)
        - recent activity (last 5 progress records with content_type name)
        """
        qs = Progress.objects.filter(user=request.user).select_related('content_type')
        recent_qs = qs.order_by('-last_reviewed')[:5]

        MODEL_LABEL_MAP = {
            'vocabulary': 'Từ vựng',
            'audiolesson': 'Bài nghe',
            'speakinglesson': 'Bài nói',
            'quiz': 'Quiz',
            'readinglesson': 'Đọc hiểu',
            'sentencestructure': 'Cấu trúc câu',
            'sentence': 'Câu',
        }

        def build_item(progress):
            model = progress.content_type.model if progress.content_type else None
            return {
                'id': progress.id,
                'content_type': {
                    'id': progress.content_type.id if progress.content_type else None,
                    'model': model,
                    'name': MODEL_LABEL_MAP.get(model, model or 'Nội dung'),
                },
                'object_id': progress.object_id,
                'status': progress.status,
                'score': progress.score,
                'last_reviewed': progress.last_reviewed,
                'next_review': progress.next_review,
                'created_at': progress.created_at,
                'updated_at': progress.updated_at,
            }

        recent = [build_item(p) for p in recent_qs]

        agg = qs.values('content_type__model').annotate(
            count=Count('id')
        ).order_by('-count')

        counts = {}
        for row in agg:
            counts[row['content_type__model']] = row['count']

        from vocabulary.models import UserVocabulary
        from listening.models import UserListeningProgress
        from speaking.models import UserSpeakingProgress
        from question.models import UserQuizAttempt
        from reading.models import UserReadingProgress
        from sentence.models import SentenceStructure

        user = request.user
        stats = {
            'vocabulary_count': UserVocabulary.objects.filter(user=user).count(),
            'listening_count': UserListeningProgress.objects.filter(user=user).count(),
            'speaking_count': UserSpeakingProgress.objects.filter(user=user).count(),
            'quiz_count': UserQuizAttempt.objects.filter(user=user).count(),
            'reading_count': UserReadingProgress.objects.filter(user=user).count(),
            'sentence_count': SentenceStructure.objects.filter(is_published=True).count(),
        }
        # Prefer skill-table counts; fall back to generic Progress if all zero
        if not any(stats.values()):
            stats = {
                'vocabulary_count': counts.get('vocabulary', 0),
                'listening_count': counts.get('audiolesson', 0),
                'speaking_count': counts.get('speakinglesson', 0),
                'quiz_count': counts.get('quiz', 0),
                'reading_count': counts.get('readinglesson', 0),
                'sentence_count': counts.get('sentencestructure', 0) + counts.get('sentence', 0),
            }

        return Response({
            'stats': stats,
            'recent_progress': recent,
        })


def fixtures_test_view(request):
    # Confirms the fixture file exists so the frontend or tests can sanity check it.
    fixture_paths = [
        os.path.join(settings.BASE_DIR, "fixtures", "seed_data.json"),
        os.path.join(settings.BASE_DIR, "common", "fixtures", "seed_data.json"),
    ]
    found = next((p for p in fixture_paths if os.path.exists(p)), None)
    payload = {
        "fixture": "seed_data.json",
        "found_path": found,
        "checked_paths": fixture_paths,
    }
    if not found:
        return JsonResponse(payload, status=404)
    return JsonResponse(payload)


class UserPreferenceViewSet(viewsets.ModelViewSet):
    serializer_class = UserPreferenceSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None # Preference is singletons, no pagination

    def get_queryset(self):
        return UserPreference.objects.filter(user=self.request.user).select_related('user', 'preferred_level').prefetch_related('preferred_topics')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get', 'patch'], url_path='me')
    def me(self, request):
        pref, _ = UserPreference.objects.get_or_create(user=request.user)
        if request.method == 'PATCH':
            serializer = self.get_serializer(pref, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        return Response(self.get_serializer(pref).data)
