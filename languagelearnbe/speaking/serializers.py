from rest_framework import serializers
from .models import (
    SpeakingLesson, PronunciationPattern, SpeakingExercise,
    UserSpeakingAttempt, UserSpeakingProgress
)
from common.serializers import LevelSerializer, TopicSerializer

class PronunciationPatternSerializer(serializers.ModelSerializer):
    level_details = LevelSerializer(source='level', read_only=True)

    class Meta:
        model = PronunciationPattern
        fields = ['id', 'pattern', 'description', 'phonetic', 'example_words',
                 'audio', 'level', 'order', 'level_details', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class SpeakingExerciseSerializer(serializers.ModelSerializer):
    pronunciation_patterns_details = PronunciationPatternSerializer(
        source='pronunciation_patterns', many=True, read_only=True
    )
    user_attempts = serializers.SerializerMethodField()

    class Meta:
        model = SpeakingExercise
        fields = ['id', 'lesson', 'title', 'instruction', 'example_audio',
                 'exercise_type', 'prompt', 'image', 'expected_duration',
                 'sample_answer', 'sample_answer_audio', 'pronunciation_patterns',
                 'pronunciation_patterns_details', 'order', 'user_attempts',
                 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def get_user_attempts(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if user and user.is_authenticated:
            attempts = obj.userspeakingattempt_set.filter(user=user)
            return UserSpeakingAttemptSerializer(attempts, many=True).data
        return []

class SpeakingLessonSerializer(serializers.ModelSerializer):
    level_details = LevelSerializer(source='level', read_only=True)
    topics_details = TopicSerializer(source='topics', many=True, read_only=True)
    exercises = SpeakingExerciseSerializer(many=True, read_only=True)
    progress = serializers.SerializerMethodField()

    class Meta:
        model = SpeakingLesson
        fields = ['id', 'title', 'description', 'level', 'topics', 'order',
                 'is_published', 'duration', 'instruction', 'example_audio',
                 'tips', 'level_details', 'topics_details', 'exercises',
                 'progress', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def get_progress(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if user and user.is_authenticated:
            progress = obj.userspeakingprogress_set.filter(user=user).first()
            if progress:
                return UserSpeakingProgressSerializer(progress).data
        return None

class UserSpeakingAttemptSerializer(serializers.ModelSerializer):
    exercise_details = serializers.SerializerMethodField()
    overall_score = serializers.SerializerMethodField()

    class Meta:
        model = UserSpeakingAttempt
        fields = ['id', 'user', 'exercise', 'audio_recording', 'duration',
                 'transcription', 'pronunciation_score', 'fluency_score',
                 'accuracy_score', 'feedback', 'retry_count', 'exercise_details',
                 'overall_score', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def get_exercise_details(self, obj):
        return {
            'title': obj.exercise.title,
            'type': obj.exercise.exercise_type,
            'expected_duration': obj.exercise.expected_duration
        }

    def get_overall_score(self, obj):
        scores = [
            obj.pronunciation_score or 0,
            obj.fluency_score or 0,
            obj.accuracy_score or 0
        ]
        valid_scores = [score for score in scores if score > 0]
        return sum(valid_scores) / len(valid_scores) if valid_scores else 0

class UserSpeakingProgressSerializer(serializers.ModelSerializer):
    lesson_details = serializers.SerializerMethodField()
    overall_score = serializers.SerializerMethodField()

    class Meta:
        model = UserSpeakingProgress
        fields = ['id', 'user', 'lesson', 'completed', 'completion_date',
                 'average_pronunciation_score', 'average_fluency_score',
                 'average_accuracy_score', 'total_practice_time', 'favorite',
                 'notes', 'lesson_details', 'overall_score', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def get_lesson_details(self, obj):
        return {
            'title': obj.lesson.title,
            'duration': obj.lesson.duration,
            'level': obj.lesson.level.name if obj.lesson.level else None
        }

    def get_overall_score(self, obj):
        scores = [
            obj.average_pronunciation_score or 0,
            obj.average_fluency_score or 0,
            obj.average_accuracy_score or 0
        ]
        valid_scores = [score for score in scores if score > 0]
        return sum(valid_scores) / len(valid_scores) if valid_scores else 0 