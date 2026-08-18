from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from common.mixins import StandardResultsSetPagination
from common.grading import answers_match
from .models import AudioLesson, ListeningExercise, UserListeningProgress, ListeningExerciseAttempt
from .serializers import (
    AudioLessonSerializer, ListeningExerciseSerializer,
    UserListeningProgressSerializer, ListeningExerciseAttemptSerializer
)


class AudioLessonViewSet(viewsets.ModelViewSet):
    queryset = AudioLesson.objects.filter(is_published=True).select_related('level').prefetch_related('topics', 'exercises')
    serializer_class = AudioLessonSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['order', 'created_at']
    ordering = ['order']
    pagination_class = StandardResultsSetPagination
    filterset_fields = ['level']


class ListeningExerciseViewSet(viewsets.ModelViewSet):
    queryset = ListeningExercise.objects.all().select_related('lesson').prefetch_related('lesson__topics')
    serializer_class = ListeningExerciseSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['order']
    ordering = ['order']
    pagination_class = StandardResultsSetPagination
    filterset_fields = ['lesson']

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def submit_answer(self, request, pk=None):
        exercise = self.get_object()
        user_answer = request.data.get('answer', request.data.get('user_answer', ''))
        is_correct = answers_match(exercise.correct_answer, user_answer)
        time_taken = timedelta(seconds=int(request.data.get('time_taken', 0) or 0))
        attempt, created = ListeningExerciseAttempt.objects.get_or_create(
            user=request.user,
            exercise=exercise,
            defaults={
                'user_answer': user_answer,
                'is_correct': is_correct,
                'time_taken': time_taken,
                'attempts_count': 1,
            },
        )
        if not created:
            attempt.user_answer = user_answer
            attempt.is_correct = is_correct
            attempt.time_taken = time_taken
            attempt.attempts_count += 1
            attempt.save()
        progress, _ = UserListeningProgress.objects.get_or_create(
            user=request.user, lesson=exercise.lesson,
            defaults={'last_position': timedelta(0)},
        )
        total = exercise.lesson.exercises.count()
        correct_count = ListeningExerciseAttempt.objects.filter(
            user=request.user, exercise__lesson=exercise.lesson, is_correct=True
        ).count()
        if total and correct_count >= total:
            progress.completed = True
            progress.completion_date = timezone.now()
            progress.save()
        return Response({
            'is_correct': is_correct,
            'correct_answer': exercise.correct_answer if True else None,
            'explanation': exercise.explanation,
            'attempt': ListeningExerciseAttemptSerializer(attempt, context={'request': request}).data,
        }, status=status.HTTP_200_OK)


class UserListeningProgressViewSet(viewsets.ModelViewSet):
    serializer_class = UserListeningProgressSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['completion_date', 'times_played']
    ordering = ['-completion_date']
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return UserListeningProgress.objects.filter(user=self.request.user).select_related('lesson', 'lesson__level')

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        qs = self.get_queryset()
        total = qs.count()
        completed = qs.filter(completed=True).count()
        attempts = ListeningExerciseAttempt.objects.filter(user=request.user)
        acc = 0
        if attempts.exists():
            acc = attempts.filter(is_correct=True).count() / attempts.count() * 100
        return Response({
            'total_lessons': total,
            'completed': completed,
            'accuracy': round(acc, 2),
        })

    @action(detail=True, methods=['post'])
    def toggle_favorite(self, request, pk=None):
        progress = self.get_object()
        progress.favorite = not progress.favorite
        progress.save()
        return Response({'favorite': progress.favorite})


class ListeningExerciseAttemptViewSet(viewsets.ModelViewSet):
    serializer_class = ListeningExerciseAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return ListeningExerciseAttempt.objects.filter(user=self.request.user).select_related('exercise', 'exercise__lesson')
