from django.db import models

# Create your models here.

class Lesson(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    level = models.ForeignKey('common.Level', on_delete=models.SET_NULL, null=True)
    topics = models.ManyToManyField('common.Topic', blank=True)
    vocabulary = models.ManyToManyField('vocabulary.Vocabulary', blank=True)
    sentences = models.ManyToManyField('sentence.SentenceStructure', blank=True)
    listening_lessons = models.ManyToManyField('listening.AudioLesson', blank=True)
    reading_lessons = models.ManyToManyField('reading.ReadingLesson', blank=True)

    def __str__(self):
        return self.name