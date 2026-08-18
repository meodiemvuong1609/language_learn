from django.db import models
from datetime import timedelta
from common.models import BaseModel, Level, Topic
from django.conf import settings

# Create your models here.

class AudioLesson(BaseModel):
    title = models.CharField(max_length=200)
    description = models.TextField()
    audio = models.FileField(upload_to='listening/audio/')
    transcript = models.TextField()
    translation = models.TextField(blank=True)
    duration = models.DurationField()
    level = models.ForeignKey(Level, on_delete=models.SET_NULL, null=True)
    topics = models.ManyToManyField(Topic)
    order = models.IntegerField(default=0)
    is_published = models.BooleanField(default=False)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

class ListeningExercise(BaseModel):
    lesson = models.ForeignKey(AudioLesson, on_delete=models.CASCADE, related_name='exercises')
    question = models.TextField()
    audio_segment = models.FileField(upload_to='listening/exercises/', blank=True)
    segment_start = models.DurationField(null=True, blank=True)
    segment_end = models.DurationField(null=True, blank=True)
    correct_answer = models.TextField()
    options = models.JSONField(default=list)  # For multiple choice questions
    exercise_type = models.CharField(max_length=50, choices=[
        ('multiple_choice', 'Multiple Choice'),
        ('fill_blank', 'Fill in the Blank'),
        ('dictation', 'Dictation'),
        ('true_false', 'True/False')
    ])
    order = models.IntegerField(default=0)
    explanation = models.TextField(blank=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.lesson.title} - Exercise {self.order}"

class UserListeningProgress(BaseModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    lesson = models.ForeignKey(AudioLesson, on_delete=models.CASCADE)
    last_position = models.DurationField(default=timedelta(0))  # Where the user left off
    completed = models.BooleanField(default=False)
    completion_date = models.DateTimeField(null=True, blank=True)
    times_played = models.IntegerField(default=0)
    favorite = models.BooleanField(default=False)
    notes = models.TextField(blank=True)

    class Meta:
        unique_together = ['user', 'lesson']

    def __str__(self):
        return f"{self.user.username} - {self.lesson.title}"

class ListeningExerciseAttempt(BaseModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    exercise = models.ForeignKey(ListeningExercise, on_delete=models.CASCADE)
    user_answer = models.TextField()
    is_correct = models.BooleanField()
    time_taken = models.DurationField()
    attempts_count = models.IntegerField(default=1)

    class Meta:
        unique_together = ['user', 'exercise']

    def __str__(self):
        return f"{self.user.username} - {self.exercise.lesson.title} - Exercise {self.exercise.order}"
