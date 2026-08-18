from rest_framework import serializers
from .models import Quiz, Question, UserQuizAttempt


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'quiz', 'question_text', 'options', 'explanation', 'question_type', 'difficulty', 'points', 'order']
        read_only_fields = ('created_by', 'updated_by')


class QuizSerializer(serializers.ModelSerializer):
    from common.serializers import LevelSerializer, TopicSerializer
    level_details = LevelSerializer(source='level', read_only=True)
    topics_details = TopicSerializer(source='topics', many=True, read_only=True)
    questions = QuestionSerializer(many=True, read_only=True)
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'level', 'level_details', 'topics', 'topics_details', 'questions_count', 'time_limit', 'passing_score', 'is_published', 'order', 'questions', 'created_by', 'updated_by', 'created_at', 'updated_at']


class UserQuizAttemptSerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    score_breakdown = serializers.SerializerMethodField()
    class Meta:
        model = UserQuizAttempt
        fields = ['id', 'user', 'quiz', 'quiz_title', 'score', 'max_score', 'percentage', 'passed', 'time_taken', 'answers', 'completed_at', 'is_completed', 'score_breakdown']
        read_only_fields = ('user',)

    def get_score_breakdown(self, obj):
        return {
            'correct': int(obj.score),
            'total': int(obj.max_score),
            'percentage': round(obj.percentage, 2),
            'passed': obj.passed
        }
