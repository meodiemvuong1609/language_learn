from django.db import models
from django.conf import settings

class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="%(class)s_created",
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="%(class)s_updated",
    )

    class Meta:
        abstract = True

class Level(models.Model):
    name = models.CharField(max_length=100, unique=True)  # e.g., Beginner, Intermediate, Advanced
    code = models.CharField(max_length=20, unique=True)  # e.g., A1, A2, B1, B2, C1, C2
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.name
    
class Topic(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)  # Material icon name
    order = models.IntegerField(default=0)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='children')

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.name

class Progress(BaseModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content_type = models.ForeignKey('contenttypes.ContentType', on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    status = models.CharField(max_length=20, choices=[
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('reviewing', 'Reviewing')
    ])
    score = models.FloatField(default=0)
    last_reviewed = models.DateTimeField(null=True, blank=True)
    next_review = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ['user', 'content_type', 'object_id']

class UserPreference(BaseModel):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    daily_goal = models.IntegerField(default=30)  # minutes
    preferred_level = models.ForeignKey(Level, on_delete=models.SET_NULL, null=True)
    preferred_topics = models.ManyToManyField(Topic)
    notification_enabled = models.BooleanField(default=True)
    reminder_time = models.TimeField(null=True, blank=True)
    dark_mode = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username}'s preferences"