from django.db import models
from common.models import BaseModel, Level, Topic
from django.conf import settings
from django.utils import timezone


class FlashcardDeck(BaseModel):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    level = models.ForeignKey(Level, on_delete=models.SET_NULL, null=True, blank=True)
    topics = models.ManyToManyField(Topic, blank=True)
    is_public = models.BooleanField(default=False)
    is_favorite = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['owner', 'name']

    def __str__(self):
        return self.name


class Flashcard(BaseModel):
    deck = models.ForeignKey(FlashcardDeck, on_delete=models.CASCADE, related_name='flashcards')
    front = models.CharField(max_length=500)  # Question side
    back = models.CharField(max_length=500)    # Answer side
    part_of_speech = models.CharField(max_length=50, blank=True)
    example_sentence = models.TextField(blank=True)
    difficulty = models.IntegerField(default=1)  # 1-5
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return self.front


class UserFlashcardProgress(BaseModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    flashcard = models.ForeignKey(Flashcard, on_delete=models.CASCADE)
    mastery_level = models.IntegerField(default=0)  # 0-5
    last_reviewed = models.DateTimeField(null=True, blank=True)
    next_review = models.DateTimeField(null=True, blank=True)
    review_count = models.IntegerField(default=0)
    correct_count = models.IntegerField(default=0)

    class Meta:
        unique_together = ['user', 'flashcard']
        ordering = ['-next_review']

    def __str__(self):
        return f"{self.user.username} - {self.flashcard.front}"
