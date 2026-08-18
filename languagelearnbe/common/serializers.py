from rest_framework import serializers
from .models import Level, Topic, Progress, UserPreference

class LevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        fields = ['id', 'name', 'code', 'description', 'order']

class TopicSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = Topic
        fields = ['id', 'name', 'description', 'icon', 'order', 'parent', 'children']

    def get_children(self, obj):
        if hasattr(obj, 'children'):
            return TopicSerializer(obj.children.all(), many=True).data
        return []

class ProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Progress
        fields = ['id', 'user', 'content_type', 'object_id', 'status', 'score',
                 'last_reviewed', 'next_review', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class UserPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreference
        fields = ['id', 'user', 'daily_goal', 'preferred_level', 'preferred_topics',
                 'notification_enabled', 'reminder_time', 'dark_mode', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at'] 