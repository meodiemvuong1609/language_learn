from django.db import models
from common.models import BaseModel

# Create your models here.

class ReadingLesson(BaseModel):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    content = models.TextField()
    word_count = models.PositiveIntegerField(default=0)
    estimated_duration = models.IntegerField(default=0)  # in minutes
    level = models.ForeignKey('common.Level', on_delete=models.SET_NULL, null=True, blank=True)
    topics = models.ManyToManyField('common.Topic', blank=True)
    is_published = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    image = models.ImageField(upload_to='reading/images/', blank=True, null=True)
    audio = models.FileField(upload_to='reading/audio/', blank=True, null=True)
    difficulty = models.IntegerField(default=1, choices=[(1, 'Easy'), (2, 'Medium'), (3, 'Hard')])

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return self.title


class ReadingParagraph(BaseModel):
    lesson = models.ForeignKey(ReadingLesson, on_delete=models.CASCADE, related_name='paragraphs')
    content = models.TextField()
    order = models.IntegerField(default=0)
    translation = models.TextField(blank=True)
    vocabulary_items = models.ManyToManyField('vocabulary.Vocabulary', blank=True, related_name='paragraph_occurrences')

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.lesson.title} - Paragraph {self.order}"


class ReadingVocabularyItem(BaseModel):
    paragraph = models.ForeignKey(ReadingParagraph, on_delete=models.CASCADE, related_name='vocab_items')
    word = models.CharField(max_length=100)
    meaning = models.TextField()

    def __str__(self):
        return self.word


class ReadingComprehension(BaseModel):
    lesson = models.ForeignKey(ReadingLesson, on_delete=models.CASCADE, related_name='comprehension_questions')
    question_text = models.TextField()
    options = models.JSONField(default=dict)  # {a: "...", b: "...", c: "...", d: "..."}
    correct_answer = models.CharField(max_length=10)  # "a", "b", "c", or "d"
    explanation = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    difficulty = models.IntegerField(default=1)  # 1-3

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Q{self.order}: {self.lesson.title}"


class UserReadingProgress(BaseModel):
    user = models.ForeignKey('account.Account', on_delete=models.CASCADE)
    lesson = models.ForeignKey(ReadingLesson, on_delete=models.CASCADE)
    started = models.BooleanField(default=False)
    completed = models.BooleanField(default=False)
    last_paragraph = models.IntegerField(default=0)
    completed_paragraphs = models.IntegerField(default=0)
    score = models.FloatField(default=0)
    total_time = models.IntegerField(default=0)  # seconds
    last_accessed = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ['user', 'lesson']

    def __str__(self):
        return f"{self.user.username} - {self.lesson.title}"
