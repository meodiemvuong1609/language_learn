from django.contrib import admin
from account.models import Account


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ('username', 'full_name', 'email', 'role', 'status', 'is_staff')
    list_filter = ('role', 'status', 'is_staff')
    search_fields = ('username', 'email', 'full_name', 'phone')

