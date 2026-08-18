from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from common.mixins import StandardResultsSetPagination
from common.grading import answers_match
from general.general import convert_response
from .models import ReadingLesson, ReadingParagraph, ReadingComprehension, UserReadingProgress
from .serializers import (
    ReadingLessonSerializer, ReadingParagraphSerializer,
    ReadingComprehensionSerializer, UserReadingProgressSerializer
)


class ReadingLessonViewSet(viewsets.ModelViewSet):
    queryset = ReadingLesson.objects.filter(is_published=True).select_related('level').prefetch_related('topics', 'paragraphs', 'paragraphs__vocabulary_items', 'comprehension_questions')
    serializer_class = ReadingLessonSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'content']
    ordering_fields = ['order', 'created_at']
    ordering = ['order']
    pagination_class = StandardResultsSetPagination
    filterset_fields = ['level']

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def submit_comprehension(self, request, pk=None):
        lesson = self.get_object()
        answers = request.data.get('answers', {})
        questions = list(lesson.comprehension_questions.all())
        results = []
        correct = 0
        for q in questions:
            given = answers.get(str(q.id), answers.get(q.id))
            is_correct = answers_match(q.correct_answer, given)
            if is_correct:
                correct += 1
            results.append({
                'id': q.id,
                'question': q.question_text,
                'your_answer': given,
                'correct_answer': q.correct_answer,
                'explanation': q.explanation,
                'is_correct': is_correct,
            })
        total = len(questions) or 1
        percentage = round(100 * correct / total, 2)
        progress, _ = UserReadingProgress.objects.get_or_create(
            user=request.user, lesson=lesson
        )
        progress.started = True
        progress.score = percentage
        progress.completed = True
        progress.completed_at = timezone.now()
        progress.save()
        return Response(
            convert_response(
                message='Comprehension submitted successfully',
                status_code=status.HTTP_200_OK,
                data={
                    'correct': correct,
                    'total': len(questions),
                    'percentage': percentage,
                    'results': results,
                }
            ),
            status=status.HTTP_200_OK
        )


class ReadingParagraphViewSet(viewsets.ModelViewSet):
    queryset = ReadingParagraph.objects.all().select_related('lesson', 'lesson__level')
    serializer_class = ReadingParagraphSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['order']
    ordering = ['order']
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        lesson_id = self.request.query_params.get('lesson')
        if lesson_id:
            queryset = queryset.filter(lesson_id=lesson_id)
        return queryset


class ReadingComprehensionViewSet(viewsets.ModelViewSet):
    queryset = ReadingComprehension.objects.all().select_related('lesson', 'lesson__level')
    serializer_class = ReadingComprehensionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['order']
    ordering = ['order']
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        lesson_id = self.request.query_params.get('lesson')
        if lesson_id:
            queryset = queryset.filter(lesson_id=lesson_id)
        return queryset


class UserReadingProgressViewSet(viewsets.ModelViewSet):
    serializer_class = UserReadingProgressSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['last_accessed', 'completed_at']
    ordering = ['-last_accessed']
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return UserReadingProgress.objects.filter(user=self.request.user).select_related('lesson', 'lesson__level')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
