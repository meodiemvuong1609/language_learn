from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from common.mixins import StandardResultsSetPagination
from common.grading import answers_match
from .models import SentenceStructure
from .serializers import SentenceStructureSerializer


class SentenceStructureViewSet(viewsets.ModelViewSet):
    queryset = SentenceStructure.objects.filter(is_published=True).select_related('level').prefetch_related('topics', 'vocabulary_items')
    serializer_class = SentenceStructureSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['pattern', 'description', 'formula']
    ordering_fields = ['order', 'difficulty', 'created_at']
    ordering = ['order', 'difficulty']
    pagination_class = StandardResultsSetPagination
    filterset_fields = ['level', 'difficulty']

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def submit_exercise(self, request, pk=None):
        structure = self.get_object()
        answers = request.data.get('answers', {})
        items = list(structure.vocabulary_items.all())
        results = []
        correct = 0
        for item in items:
            given = answers.get(str(item.id), answers.get(item.id))
            is_correct = answers_match(item.word, given)
            if is_correct:
                correct += 1
            results.append({
                'id': item.id,
                'expected': item.word,
                'given': given,
                'is_correct': is_correct,
            })
        total = len(items) or 1
        percentage = round(100 * correct / total, 2)
        return Response({
            'correct': correct,
            'total': len(items),
            'percentage': percentage,
            'results': results,
        }, status=status.HTTP_200_OK)
