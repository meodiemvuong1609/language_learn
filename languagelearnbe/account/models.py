from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
# Create your models here.


class Account(AbstractUser):
    ROLE_TEACHER = 'teacher'
    ROLE_STUDENT = 'student'
    ROLE_CHOICES = (
        (ROLE_TEACHER, 'Teacher'),
        (ROLE_STUDENT, 'Student'),
    )

    STATUS_PENDING = 'pending'
    STATUS_ACTIVE = 'active'
    STATUS_REJECTED = 'rejected'
    STATUS_CHOICES = (
        (STATUS_PENDING, 'Pending approval'),
        (STATUS_ACTIVE, 'Active'),
        (STATUS_REJECTED, 'Rejected'),
    )

    phone           = models.CharField(max_length=20, null=True, blank=True)
    full_name       = models.CharField(max_length=50, null=True, blank=True)
    birthday        = models.DateField(null=True, blank=True, default=None)
    avatar          = models.ImageField(upload_to='account/avatar/', null=True, blank=True)
    settings        = models.JSONField(default=dict, blank=True)
    role            = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_STUDENT)
    status          = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_ACTIVE)
    created_at      = models.DateTimeField(default=timezone.now, blank=True)
    updated_at      = models.DateTimeField(null=True, blank=True, default=None)

    first_name      = None
    last_name       = None

    def __str__(self) -> str:
        return self.username

    @property
    def is_teacher(self) -> bool:
        return self.role == self.ROLE_TEACHER or self.is_staff or self.is_superuser

    @property
    def is_approved(self) -> bool:
        return self.status == self.STATUS_ACTIVE or self.is_teacher

    def save(self, *args, **kwargs):
        self.updated_at = timezone.now()
        return super().save(*args, **kwargs)
