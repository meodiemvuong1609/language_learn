from rest_framework import serializers
from .models import Vocabulary, VocabularyList, VocabularyListItem, UserVocabulary
from common.serializers import LevelSerializer, TopicSerializer

class VocabularySerializer(serializers.ModelSerializer):
    level_details = LevelSerializer(source='level', read_only=True)
    topics_details = TopicSerializer(source='topics', many=True, read_only=True)
    synonyms_details = serializers.SerializerMethodField()
    antonyms_details = serializers.SerializerMethodField()

    class Meta:
        model = Vocabulary
        fields = ['id', 'word', 'meaning', 'phonetic', 'audio', 'example_sentence', 'part_of_speech', 'level', 'level_details', 'topics', 'topics_details', 'image', 'notes', 'synonyms_details', 'antonyms_details']

    def get_synonyms_details(self, obj):
        return VocabularyBasicSerializer(obj.synonyms.all(), many=True).data

    def get_antonyms_details(self, obj):
        return VocabularyBasicSerializer(obj.antonyms.all(), many=True).data

class VocabularyBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vocabulary
        fields = ['id', 'word', 'meaning', 'part_of_speech']

class VocabularyListItemSerializer(serializers.ModelSerializer):
    vocabulary_details = VocabularySerializer(source='vocabulary', read_only=True)

    class Meta:
        model = VocabularyListItem
        fields = [
            'id', 'vocabulary_list', 'vocabulary', 'vocabulary_details',
            'order', 'notes', 'created_at', 'updated_at',
        ]

class VocabularyListSerializer(serializers.ModelSerializer):
    items = VocabularyListItemSerializer(source='vocabularylistitem_set', many=True, read_only=True)
    level_details = LevelSerializer(source='level', read_only=True)
    topics_details = TopicSerializer(source='topics', many=True, read_only=True)
    word_count = serializers.SerializerMethodField()

    class Meta:
        model = VocabularyList
        fields = [
            'id', 'name', 'description', 'owner', 'is_public', 'level',
            'level_details', 'topics', 'topics_details', 'items', 'word_count',
            'created_at', 'updated_at',
        ]
        read_only_fields = ('owner',)

    def get_word_count(self, obj):
        return obj.words.count()

class UserVocabularySerializer(serializers.ModelSerializer):
    vocabulary = VocabularySerializer(read_only=True)

    class Meta:
        model = UserVocabulary
        fields = [
            'id', 'user', 'vocabulary', 'mastery_level', 'last_reviewed',
            'next_review', 'personal_note', 'is_favorite', 'review_count',
            'correct_count', 'created_at', 'updated_at',
        ]
        read_only_fields = ('user',)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.review_count > 0:
            representation['accuracy'] = (instance.correct_count / instance.review_count) * 100
        else:
            representation['accuracy'] = 0
        return representation 