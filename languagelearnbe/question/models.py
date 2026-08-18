from django.db import models
from common.models import BaseModel

# Create your models here.

class Quiz(BaseModel):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    level = models.ForeignKey('common.Level', on_delete=models.SET_NULL, null=True, blank=True)
    topics = models.ManyToManyField('common.Topic', blank=True)
    questions_count = models.IntegerField(default=0)
    time_limit = models.IntegerField(default=0)  # minutes, 0 = no limit
    passing_score = models.FloatField(default=70)  # percentage
    is_published = models.BooleanField(default=True)
    order = models.IntegerField(default=0)

    def __str__(self):
        return self.title


class Question(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey('account.Account', on_delete=models.SET_NULL, null=True, blank=True, related_name='questions_created')
    updated_by = models.ForeignKey('account.Account', on_delete=models.SET_NULL, null=True, blank=True, related_name='questions_updated')

    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    options = models.JSONField(default=dict)  # {"a": "...", "b": "...", "c": "...", "d": "..."}
    correct_answer = models.CharField(max_length=10)  # "a", "b", "c", or "d"
    explanation = models.TextField(blank=True)
    question_type = models.CharField(max_length=50, choices=[
        ('multiple_choice', 'Multiple Choice'),
        ('true_false', 'True/False'),
        ('fill_blank', 'Fill in the Blank'),
    ], default='multiple_choice')
    difficulty = models.IntegerField(default=1)  # 1-3
    points = models.IntegerField(default=1)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Q{self.order}: {self.quiz.title}"


class UserQuizAttempt(BaseModel):
    user = models.ForeignKey('account.Account', on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    score = models.FloatField(default=0)
    max_score = models.FloatField(default=0)
    percentage = models.FloatField(default=0)
    passed = models.BooleanField(default=False)
    time_taken = models.IntegerField(default=0)  # seconds
    answers = models.JSONField(default=dict)
    completed_at = models.DateTimeField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.quiz.title}"
