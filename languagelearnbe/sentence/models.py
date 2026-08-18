from django.db import models
from common.models import Level, Topic

# Create your models here.


class SentenceStructure(models.Model):
    pattern = models.CharField(max_length=100)
    formula = models.CharField(max_length=100)
    description = models.TextField()
    difficulty = models.IntegerField(default=1)
    example_sentence = models.TextField(blank=True)
    translation = models.TextField(blank=True)
    grammar_notes = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    is_published = models.BooleanField(default=True)
    level = models.ForeignKey(Level, on_delete=models.CASCADE, null=True, blank=True)
    topics = models.ManyToManyField(Topic, blank=True)
    vocabulary = models.ManyToManyField('vocabulary.Vocabulary', blank=True)
    created_by = models.ForeignKey('account.Account', on_delete=models.SET_NULL, null=True, blank=True, related_name='sentence_created')
    updated_by = models.ForeignKey('account.Account', on_delete=models.SET_NULL, null=True, blank=True, related_name='sentence_updated')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return self.pattern


class SentenceVocabularyItem(models.Model):
    """Từ vựng có trong cấu trúc câu (dùng cho bài tập)"""
    sentence = models.ForeignKey(SentenceStructure, on_delete=models.CASCADE, related_name='vocabulary_items')
    word = models.CharField(max_length=100)
    meaning = models.CharField(max_length=255)
    position = models.CharField(max_length=50, default='', blank=True)
    part_of_speech = models.CharField(max_length=50, blank=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.word} ({self.sentence.pattern})"
