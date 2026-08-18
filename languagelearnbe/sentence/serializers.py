from rest_framework import serializers
from .models import SentenceStructure, SentenceVocabularyItem


class SentenceVocabularyItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SentenceVocabularyItem
        fields = ['id', 'word', 'meaning', 'position', 'part_of_speech']


class SentenceStructureSerializer(serializers.ModelSerializer):
    from common.serializers import LevelSerializer, TopicSerializer
    level_details = LevelSerializer(source='level', read_only=True)
    topics_details = TopicSerializer(source='topics', many=True, read_only=True)
    vocabulary_items = SentenceVocabularyItemSerializer(many=True, read_only=True)
    class Meta:
        model = SentenceStructure
        fields = ['id', 'pattern', 'formula', 'description', 'difficulty', 'order', 'is_published', 'level', 'level_details', 'topics', 'topics_details', 'vocabulary_items', 'example_sentence', 'translation', 'grammar_notes', 'created_by', 'updated_by', 'created_at', 'updated_at']
