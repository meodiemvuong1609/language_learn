from rest_framework import serializers
from .models import AudioLesson, ListeningExercise, UserListeningProgress, ListeningExerciseAttempt
from common.serializers import LevelSerializer, TopicSerializer
from common.grading import normalize_options

class ListeningExerciseSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source='question', read_only=True)
    options_map = serializers.SerializerMethodField()

    class Meta:
        model = ListeningExercise
        fields = ['id', 'lesson', 'question', 'question_text', 'audio_segment', 'segment_start',
                 'segment_end', 'exercise_type', 'order', 'explanation', 'options',
                 'options_map', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def get_options_map(self, obj):
        return normalize_options(obj.options)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['options'] = representation.get('options_map') or normalize_options(instance.options)
        user = self.context.get('request').user if self.context.get('request') else None
        
        if user and user.is_authenticated:
            attempt = instance.listeningexerciseattempt_set.filter(user=user).first()
            if attempt:
                representation['user_attempt'] = {
                    'is_correct': attempt.is_correct,
                    'attempts_count': attempt.attempts_count
                }
        return representation

class AudioLessonSerializer(serializers.ModelSerializer):
    level_details = LevelSerializer(source='level', read_only=True)
    topics_details = TopicSerializer(source='topics', many=True, read_only=True)
    exercises = ListeningExerciseSerializer(many=True, read_only=True)
    progress = serializers.SerializerMethodField()

    class Meta:
        model = AudioLesson
        fields = ['id', 'title', 'description', 'audio', 'transcript',
                 'translation', 'duration', 'level', 'topics', 'order',
                 'is_published', 'level_details', 'topics_details',
                 'exercises', 'progress', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
        extra_kwargs = {
            'audio': {'required': False, 'allow_null': True},
            'transcript': {'required': False, 'allow_blank': True},
        }

    def get_progress(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if user and user.is_authenticated:
            progress = obj.userlisteningprogress_set.filter(user=user).first()
            if progress:
                return UserListeningProgressSerializer(progress).data
        return None

class ListeningExerciseAttemptSerializer(serializers.ModelSerializer):
    exercise_details = ListeningExerciseSerializer(source='exercise', read_only=True)

    class Meta:
        model = ListeningExerciseAttempt
        fields = ['id', 'user', 'exercise', 'user_answer', 'is_correct',
                 'time_taken', 'attempts_count', 'exercise_details',
                 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class UserListeningProgressSerializer(serializers.ModelSerializer):
    lesson_details = serializers.SerializerMethodField()
    completion_percentage = serializers.SerializerMethodField()

    class Meta:
        model = UserListeningProgress
        fields = ['id', 'user', 'lesson', 'last_position', 'completed',
                 'completion_date', 'times_played', 'favorite', 'notes',
                 'lesson_details', 'completion_percentage', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def get_lesson_details(self, obj):
        return {
            'title': obj.lesson.title,
            'duration': obj.lesson.duration,
            'level': obj.lesson.level.name if obj.lesson.level else None
        }

    def get_completion_percentage(self, obj):
        if obj.completed:
            return 100
        if obj.last_position and obj.lesson.duration:
            return min(100, (obj.last_position.total_seconds() / obj.lesson.duration.total_seconds()) * 100)
        return 0 