from rest_framework import serializers

from account.models import Account


class AccountSerializer(serializers.ModelSerializer):
    is_teacher = serializers.BooleanField(read_only=True)

    class Meta:
        model = Account
        fields = [
            'id', 'username', 'email', 'phone', 'full_name', 'birthday',
            'avatar', 'settings', 'role', 'status', 'is_teacher',
            'created_at', 'updated_at',
        ]
        read_only_fields = [
            'id', 'username', 'role', 'status', 'is_teacher',
            'created_at', 'updated_at',
        ]


class TeacherStudentSerializer(serializers.ModelSerializer):
    is_teacher = serializers.BooleanField(read_only=True)

    class Meta:
        model = Account
        fields = [
            'id', 'username', 'email', 'phone', 'full_name', 'birthday',
            'avatar', 'role', 'status', 'is_teacher', 'is_active',
            'created_at', 'updated_at', 'last_login',
        ]
        read_only_fields = fields

