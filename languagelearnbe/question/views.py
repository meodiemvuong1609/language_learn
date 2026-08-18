from django.shortcuts import render
from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from common.mixins import StandardResultsSetPagination
from common.grading import answers_match
from general.general import convert_response
from .models import Quiz, Question, UserQuizAttempt
from .serializers import QuizSerializer, QuestionSerializer, UserQuizAttemptSerializer


class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.filter(is_published=True).select_related('level').prefetch_related('topics', 'questions')
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['order', 'created_at']
    ordering = ['order']
    pagination_class = StandardResultsSetPagination
    filterset_fields = ['level']

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def submit(self, request, pk=None):
        quiz = self.get_object()
        answers = request.data.get('answers', {})
        time_taken = int(request.data.get('time_taken', 0) or 0)
        questions = list(quiz.questions.all())
        results = []
        score = 0
        max_score = 0
        for q in questions:
            max_score += q.points or 1
            given = answers.get(str(q.id), answers.get(q.id))
            is_correct = answers_match(q.correct_answer, given)
            if is_correct:
                score += q.points or 1
            results.append({
                'id': q.id,
                'question': q.question_text,
                'yourAnswer': given,
                'correctAnswer': q.correct_answer,
                'explanation': q.explanation,
                'isCorrect': is_correct,
            })
        percentage = round(100 * score / max_score, 2) if max_score else 0
        passed = percentage >= quiz.passing_score
        attempt = UserQuizAttempt.objects.create(
            user=request.user,
            quiz=quiz,
            score=score,
            max_score=max_score,
            percentage=percentage,
            passed=passed,
            time_taken=time_taken,
            answers=answers,
            completed_at=timezone.now(),
            is_completed=True,
        )
        return Response(
            convert_response(
                message='Quiz submitted successfully',
                status_code=status.HTTP_201_CREATED,
                data={
                    'attempt_id': attempt.id,
                    'correct': int(score),
                    'total': len(questions),
                    'percentage': percentage,
                    'passed': passed,
                    'results': results,
                }
            ),
            status=status.HTTP_201_CREATED
        )


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all().select_related('quiz', 'quiz__level')
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['order', 'difficulty']
    ordering = ['order']
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        quiz_id = self.request.query_params.get('quiz')
        if quiz_id:
            queryset = queryset.filter(quiz_id=quiz_id)
        return queryset


class UserQuizAttemptViewSet(viewsets.ModelViewSet):
    serializer_class = UserQuizAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['completed_at', 'percentage']
    ordering = ['-completed_at']
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return UserQuizAttempt.objects.filter(user=self.request.user).select_related('quiz', 'quiz__level')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
