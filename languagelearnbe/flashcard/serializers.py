from rest_framework import serializers
from .models import FlashcardDeck, Flashcard, UserFlashcardProgress
from common.serializers import LevelSerializer, TopicSerializer


class FlashcardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flashcard
        fields = ['id', 'deck', 'front', 'back', 'part_of_speech', 'example_sentence', 'difficulty', 'order', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class FlashcardDeckSerializer(serializers.ModelSerializer):
    level_details = LevelSerializer(source='level', read_only=True)
    topics_details = TopicSerializer(source='topics', many=True, read_only=True)
    card_count = serializers.SerializerMethodField()

    class Meta:
        model = FlashcardDeck
        fields = ['id', 'name', 'description', 'owner', 'level', 'level_details', 'topics', 'topics_details',
                  'is_public', 'is_favorite', 'card_count', 'created_at', 'updated_at']
        read_only_fields = ['owner', 'created_at', 'updated_at']

    def get_card_count(self, obj):
        annotated = obj.__dict__.get('card_count')
        if isinstance(annotated, int):
            return annotated
        return obj.flashcards.count()


class FlashcardDeckDetailSerializer(serializers.ModelSerializer):
    level_details = LevelSerializer(source='level', read_only=True)
    topics_details = TopicSerializer(source='topics', many=True, read_only=True)
    cards = FlashcardSerializer(source='flashcards', many=True, read_only=True)
    card_count = serializers.SerializerMethodField()

    class Meta:
        model = FlashcardDeck
        fields = ['id', 'name', 'description', 'owner', 'level', 'level_details', 'topics', 'topics_details',
                  'is_public', 'is_favorite', 'card_count', 'cards', 'created_at', 'updated_at']
        read_only_fields = ['owner', 'created_at', 'updated_at']

    def get_card_count(self, obj):
        annotated = obj.__dict__.get('card_count')
        if isinstance(annotated, int):
            return annotated
        return obj.flashcards.count()


class UserFlashcardProgressSerializer(serializers.ModelSerializer):
    flashcard_details = FlashcardSerializer(source='flashcard', read_only=True)

    class Meta:
        model = UserFlashcardProgress
        fields = ['id', 'user', 'flashcard', 'flashcard_details', 'mastery_level', 'last_reviewed',
                  'next_review', 'review_count', 'correct_count', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.review_count > 0:
            representation['accuracy'] = round((instance.correct_count / instance.review_count) * 100, 1)
        else:
            representation['accuracy'] = 0
        return representation
