from rest_framework import serializers

from account.models import Account


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'username', 'email', 'phone', 'full_name', 'birthday', 'avatar', 'settings', 'created_at', 'updated_at']
        read_only_fields = ['id', 'username', 'created_at', 'updated_at']

