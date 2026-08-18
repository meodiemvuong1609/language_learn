from django.db import models
from common.models import BaseModel, Level, Topic
from django.conf import settings

# Create your models here.

class Vocabulary(BaseModel):
    word = models.CharField(max_length=100)
    meaning = models.TextField()
    phonetic = models.CharField(max_length=100, blank=True)
    audio = models.FileField(upload_to='vocabulary/audio/', blank=True)
    example_sentence = models.TextField(blank=True)
    part_of_speech = models.CharField(max_length=50, choices=[
        ('noun', 'Noun'),
        ('verb', 'Verb'),
        ('adjective', 'Adjective'),
        ('adverb', 'Adverb'),
        ('preposition', 'Preposition'),
        ('conjunction', 'Conjunction'),
        ('pronoun', 'Pronoun'),
        ('interjection', 'Interjection')
    ])
    topics = models.ManyToManyField(Topic, blank=True)
    level = models.ForeignKey(Level, on_delete=models.SET_NULL, null=True)
    synonyms = models.ManyToManyField('self', blank=True)
    antonyms = models.ManyToManyField('self', blank=True)
    image = models.ImageField(upload_to='vocabulary/images/', blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = "vocabularies"
        ordering = ['word']

    def __str__(self):
        return self.word

class VocabularyList(BaseModel):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    words = models.ManyToManyField(Vocabulary, through='VocabularyListItem')
    is_public = models.BooleanField(default=False)
    level = models.ForeignKey(Level, on_delete=models.SET_NULL, null=True, blank=True)
    topics = models.ManyToManyField(Topic, blank=True)

    def __str__(self):
        return self.name

class VocabularyListItem(BaseModel):
    vocabulary_list = models.ForeignKey(VocabularyList, on_delete=models.CASCADE)
    vocabulary = models.ForeignKey(Vocabulary, on_delete=models.CASCADE)
    order = models.IntegerField(default=0)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['order']
        unique_together = ['vocabulary_list', 'vocabulary']

class UserVocabulary(BaseModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    vocabulary = models.ForeignKey(Vocabulary, on_delete=models.CASCADE)
    mastery_level = models.IntegerField(default=0)  # 0-5
    last_reviewed = models.DateTimeField(null=True, blank=True)
    next_review = models.DateTimeField(null=True, blank=True)
    personal_note = models.TextField(blank=True)
    is_favorite = models.BooleanField(default=False)
    review_count = models.IntegerField(default=0)
    correct_count = models.IntegerField(default=0)

    class Meta:
        unique_together = ['user', 'vocabulary']
        verbose_name_plural = "user vocabularies"

    def __str__(self):
        return f"{self.user.username} - {self.vocabulary.word}"