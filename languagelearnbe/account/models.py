from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
# Create your models here.


class Account(AbstractUser):
    phone           = models.CharField(max_length=20, null=True, blank=True)
    full_name       = models.CharField(max_length=50, null=True, blank=True)
    birthday        = models.DateField(null=True, blank=True, default=None)
    avatar          = models.ImageField(upload_to='account/avatar/', null=True, blank=True)
    settings        = models.JSONField(default=dict, blank=True)
    created_at      = models.DateTimeField(default=timezone.now, blank=True)
    updated_at      = models.DateTimeField(null=True, blank=True, default=None)

    first_name      = None
    last_name       = None

    def __str__(self) -> str:
        return self.username

    def save(self, *args, **kwargs):
        self.updated_at = timezone.now()
        return super().save(*args, **kwargs)
