from django.db import models
from datetime import timedelta
from common.models import BaseModel, Level, Topic
from django.conf import settings

# Create your models here.

class SpeakingLesson(BaseModel):
    title = models.CharField(max_length=200)
    description = models.TextField()
    level = models.ForeignKey(Level, on_delete=models.SET_NULL, null=True)
    topics = models.ManyToManyField(Topic)
    order = models.IntegerField(default=0)
    is_published = models.BooleanField(default=False)
    duration = models.DurationField(default=timedelta(0))
    instruction = models.TextField(blank=True)
    example_audio = models.FileField(upload_to='speaking/examples/', blank=True)
    tips = models.TextField(blank=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

class PronunciationPattern(BaseModel):
    pattern = models.CharField(max_length=100)  # e.g., "th", "ph", "tion"
    description = models.TextField()
    phonetic = models.CharField(max_length=100, blank=True)
    example_words = models.JSONField(default=list)
    audio = models.FileField(upload_to='speaking/pronunciation/', blank=True)
    level = models.ForeignKey(Level, on_delete=models.SET_NULL, null=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.pattern

class SpeakingExercise(BaseModel):
    lesson = models.ForeignKey(SpeakingLesson, on_delete=models.CASCADE, related_name='exercises')
    title = models.CharField(max_length=200)
    instruction = models.TextField(blank=True)
    example_audio = models.FileField(upload_to='speaking/exercises/examples/', blank=True)
    exercise_type = models.CharField(max_length=50, choices=[
        ('repeat', 'Repeat After Me'),
        ('answer', 'Answer Question'),
        ('describe', 'Describe Image'),
        ('roleplay', 'Role Play'),
        ('pronunciation', 'Pronunciation Practice')
    ])
    prompt = models.TextField()  # Text or image description to respond to
    image = models.ImageField(upload_to='speaking/exercises/images/', blank=True)
    expected_duration = models.DurationField(default=timedelta(0))
    sample_answer = models.TextField(blank=True)
    sample_answer_audio = models.FileField(upload_to='speaking/exercises/samples/', blank=True)
    pronunciation_patterns = models.ManyToManyField(PronunciationPattern, blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.lesson.title} - {self.title}"

class UserSpeakingAttempt(BaseModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    exercise = models.ForeignKey(SpeakingExercise, on_delete=models.CASCADE)
    audio_recording = models.FileField(upload_to='speaking/attempts/', blank=True, null=True)
    duration = models.DurationField(default=timedelta(0))
    transcription = models.TextField(blank=True)  # AI-generated transcription
    pronunciation_score = models.FloatField(null=True, blank=True)  # 0-100
    fluency_score = models.FloatField(null=True, blank=True)  # 0-100
    accuracy_score = models.FloatField(null=True, blank=True)  # 0-100
    feedback = models.TextField(blank=True)
    retry_count = models.IntegerField(default=0)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.exercise.title}"

class UserSpeakingProgress(BaseModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    lesson = models.ForeignKey(SpeakingLesson, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    completion_date = models.DateTimeField(null=True, blank=True)
    average_pronunciation_score = models.FloatField(null=True, blank=True)
    average_fluency_score = models.FloatField(null=True, blank=True)
    average_accuracy_score = models.FloatField(null=True, blank=True)
    total_practice_time = models.DurationField(default=timedelta(0))
    favorite = models.BooleanField(default=False)
    notes = models.TextField(blank=True)

    class Meta:
        unique_together = ['user', 'lesson']

    def __str__(self):
        return f"{self.user.username} - {self.lesson.title}"
