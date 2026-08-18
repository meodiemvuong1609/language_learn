from rest_framework import serializers
from .models import ReadingLesson, ReadingParagraph, ReadingVocabularyItem, ReadingComprehension, UserReadingProgress


class ReadingVocabularyItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReadingVocabularyItem
        fields = ['id', 'word', 'meaning']


class ReadingParagraphSerializer(serializers.ModelSerializer):
    vocabulary_items = serializers.SerializerMethodField()

    class Meta:
        model = ReadingParagraph
        fields = ['id', 'lesson', 'content', 'order', 'translation', 'vocabulary_items', 'created_at']

    def get_vocabulary_items(self, obj):
        inline = obj.vocab_items.all()
        if inline:
            return ReadingVocabularyItemSerializer(inline, many=True).data
        return [{'id': v.id, 'word': v.word, 'meaning': v.meaning} for v in obj.vocabulary_items.all()]


class ReadingComprehensionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReadingComprehension
        fields = ['id', 'lesson', 'question_text', 'options', 'explanation', 'order', 'difficulty']


class ReadingLessonSerializer(serializers.ModelSerializer):
    from common.serializers import LevelSerializer, TopicSerializer
    level_details = LevelSerializer(source='level', read_only=True)
    topics_details = TopicSerializer(source='topics', many=True, read_only=True)
    paragraphs = ReadingParagraphSerializer(many=True, read_only=True)
    comprehension_questions = ReadingComprehensionSerializer(many=True, read_only=True)
    class Meta:
        model = ReadingLesson
        fields = ['id', 'title', 'description', 'content', 'word_count', 'estimated_duration', 'level', 'level_details', 'topics', 'topics_details', 'is_published', 'order', 'image', 'audio', 'difficulty', 'paragraphs', 'comprehension_questions', 'created_by', 'updated_by', 'created_at', 'updated_at']


class UserReadingProgressSerializer(serializers.ModelSerializer):
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)
    level_name = serializers.CharField(source='lesson.level.name', read_only=True)
    class Meta:
        model = UserReadingProgress
        fields = ['id', 'user', 'lesson', 'lesson_title', 'level_name', 'started', 'completed', 'last_paragraph', 'completed_paragraphs', 'score', 'total_time', 'last_accessed', 'completed_at']
        read_only_fields = ('user',)
