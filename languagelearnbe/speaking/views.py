from django.shortcuts import render
from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from datetime import timedelta
from django.db.models import Avg
from django.utils import timezone
from common.mixins import StandardResultsSetPagination
from .models import (
    SpeakingLesson, PronunciationPattern, SpeakingExercise,
    UserSpeakingAttempt, UserSpeakingProgress
)
from .serializers import (
    SpeakingLessonSerializer, PronunciationPatternSerializer,
    SpeakingExerciseSerializer, UserSpeakingAttemptSerializer,
    UserSpeakingProgressSerializer
)


class SpeakingLessonViewSet(viewsets.ModelViewSet):
    queryset = SpeakingLesson.objects.filter(is_published=True).select_related('level').prefetch_related('topics', 'exercises')
    serializer_class = SpeakingLessonSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['order', 'created_at']
    ordering = ['order']
    pagination_class = StandardResultsSetPagination
    filterset_fields = ['level']


class PronunciationPatternViewSet(viewsets.ModelViewSet):
    queryset = PronunciationPattern.objects.all().select_related('level')
    serializer_class = PronunciationPatternSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['pattern', 'description']
    ordering_fields = ['order', 'pattern']
    ordering = ['order']
    pagination_class = StandardResultsSetPagination


class SpeakingExerciseViewSet(viewsets.ModelViewSet):
    queryset = SpeakingExercise.objects.all().select_related('lesson').prefetch_related('pronunciation_patterns', 'lesson__topics')
    serializer_class = SpeakingExerciseSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['order']
    ordering = ['order']
    pagination_class = StandardResultsSetPagination
    filterset_fields = ['lesson']


class UserSpeakingProgressViewSet(viewsets.ModelViewSet):
    serializer_class = UserSpeakingProgressSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['completion_date', 'total_practice_time']
    ordering = ['-completion_date']
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return UserSpeakingProgress.objects.filter(user=self.request.user).select_related('lesson', 'lesson__level')


class UserSpeakingAttemptViewSet(viewsets.ModelViewSet):
    serializer_class = UserSpeakingAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return UserSpeakingAttempt.objects.filter(user=self.request.user).select_related('exercise', 'exercise__lesson')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'])
    def submit_self_score(self, request):
        exercise_id = request.data.get('exercise')
        if not exercise_id:
            return Response({'error': 'exercise is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            exercise = SpeakingExercise.objects.get(pk=exercise_id)
        except SpeakingExercise.DoesNotExist:
            return Response({'error': 'exercise not found'}, status=status.HTTP_404_NOT_FOUND)
        score = float(request.data.get('self_score', 0) or 0)
        score = max(0, min(100, score))
        seconds = int(request.data.get('duration_seconds', 0) or 0)
        feedback = request.data.get('feedback', '')
        attempt = UserSpeakingAttempt.objects.create(
            user=request.user,
            exercise=exercise,
            duration=timedelta(seconds=seconds),
            pronunciation_score=score,
            fluency_score=score,
            accuracy_score=score,
            feedback=feedback or ('Tự chấm điểm' if score else ''),
        )
        audio = request.FILES.get('audio_recording') or request.FILES.get('audio')
        if audio:
            attempt.audio_recording = audio
            attempt.save(update_fields=['audio_recording'])
        progress, _ = UserSpeakingProgress.objects.get_or_create(
            user=request.user, lesson=exercise.lesson,
            defaults={'total_practice_time': timedelta(0)},
        )
        attempts = UserSpeakingAttempt.objects.filter(
            user=request.user, exercise__lesson=exercise.lesson
        )
        agg = attempts.aggregate(
            p=Avg('pronunciation_score'),
            f=Avg('fluency_score'),
            a=Avg('accuracy_score'),
        )
        progress.average_pronunciation_score = agg['p']
        progress.average_fluency_score = agg['f']
        progress.average_accuracy_score = agg['a']
        progress.completed = True
        progress.completion_date = timezone.now()
        progress.save()
        return Response(
            UserSpeakingAttemptSerializer(attempt, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )
