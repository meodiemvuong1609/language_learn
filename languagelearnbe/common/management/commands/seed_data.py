#!/usr/bin/env python
"""Seed database with sample data for Language Learning Platform

Usage:
    python manage.py seed_data
    python manage.py seed_data --clean  # Delete all existing data first
"""

import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "be.settings")
django.setup()

import random
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from django.db import transaction

from account.models import Account
from common.models import Level, Topic
from vocabulary.models import Vocabulary, UserVocabulary
from listening.models import AudioLesson, ListeningExercise
from speaking.models import SpeakingLesson, PronunciationPattern, SpeakingExercise, UserSpeakingProgress
from sentence.models import SentenceStructure
from reading.models import ReadingLesson, ReadingParagraph, ReadingComprehension
from question.models import Quiz, Question
from flashcard.models import FlashcardDeck, Flashcard
from lesson.models import Lesson

# CONFIG
RANDOM_SEED = 42
random.seed(RANDOM_SEED)

DURATION = lambda s: timedelta(seconds=s)
NOW = timezone.now()


class Command(BaseCommand):
    help = 'Seed database with sample data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clean',
            action='store_true',
            help='Delete all existing data before seeding',
        )

    def handle(self, *args, **options):
        if options['clean']:
            self.stdout.write('Cleaning database...')
            self.clean_database()

        self.stdout.write('Seeding database...')
        with transaction.atomic():
            self.seed_data()

        self.stdout.write(self.style.SUCCESS('Successfully seeded database'))

    def clean_database(self):
        """Delete all existing data"""
        with transaction.atomic():
            # Delete in order to respect foreign key constraints
            Question.objects.all().delete()
            Quiz.objects.all().delete()
            ReadingComprehension.objects.all().delete()
            ReadingParagraph.objects.all().delete()
            ReadingLesson.objects.all().delete()
            ListeningExercise.objects.all().delete()
            AudioLesson.objects.all().delete()
            UserVocabulary.objects.all().delete()
            Flashcard.objects.all().delete()
            FlashcardDeck.objects.all().delete()
            Vocabulary.objects.all().delete()
            PronunciationPattern.objects.all().delete()
            SpeakingLesson.objects.all().delete()
            SentenceStructure.objects.all().delete()
            Account.objects.filter(is_superuser=False).delete()
            Topic.objects.all().delete()
            Level.objects.all().delete()

        self.stdout.write('Database cleaned')

    def seed_data(self):
        """Main seeding logic"""
        # Create base data
        self.create_levels()
        self.create_topics()

        # Create users
        self.create_test_users()

        # Create content
        self.create_vocabulary()
        self.create_sentences()
        self.create_listening_lessons()
        self.create_reading_lessons()
        self.create_quizzes()
        self.create_speaking_lessons()
        self.create_flashcards()

    def create_levels(self):
        """Create language levels"""
        levels_data = [
            ('A1', 'Beginner', 'Beginner level', 1),
            ('A2', 'Elementary', 'Elementary level', 2),
            ('B1', 'Intermediate', 'Intermediate level', 3),
            ('B2', 'Upper Intermediate', 'Upper Intermediate level', 4),
            ('C1', 'Advanced', 'Advanced level', 5),
        ]

        for code, name, desc, order in levels_data:
            Level.objects.get_or_create(
                code=code,
                defaults={'name': name, 'description': desc, 'order': order}
            )

        self.stdout.write(f'  Created {len(levels_data)} levels')

    def create_topics(self):
        """Create topics"""
        topics_data = [
            ('Greetings', 'Greetings and basic phrases', 'wave', 1),
            ('Family', 'Family members and relationships', 'people', 2),
            ('Food', 'Food, drinks, and dining', 'restaurant', 3),
            ('Travel', 'Travel and transportation', 'flight', 4),
            ('Work', 'Workplace and professional life', 'work', 5),
            ('Education', 'School and learning', 'school', 6),
            ('Health', 'Health and wellness', 'fitness_center', 7),
            ('Technology', 'Technology and digital life', 'computer', 8),
            ('Environment', 'Nature and environment', 'eco', 9),
            ('Culture', 'Culture and customs', 'theater_comedy', 10),
        ]

        for name, desc, icon, order in topics_data:
            Topic.objects.get_or_create(
                name=name,
                defaults={'description': desc, 'icon': icon, 'order': order}
            )

        self.stdout.write(f'  Created {len(topics_data)} topics')

    def create_test_users(self):
        """Create 5 test users"""
        users_data = [
            ('student1', 'student1@test.com', 'Student One'),
            ('student2', 'student2@test.com', 'Student Two'),
            ('student3', 'student3@test.com', 'Student Three'),
            ('student4', 'student4@test.com', 'Student Four'),
            ('student5', 'student5@test.com', 'Student Five'),
        ]

        for username, email, full_name in users_data:
            Account.objects.get_or_create(
                username=username,
                defaults={
                    'email': email,
                    'full_name': full_name,
                    'password': make_password('Student123!'),
                }
            )

        self.stdout.write(f'  Created {len(users_data)} test users')

    def create_vocabulary(self):
        """Create 100 vocabulary words"""
        a1_level = Level.objects.get(code='A1')
        greetings = Topic.objects.get(name='Greetings')
        for i in range(100):
            vocab, _ = Vocabulary.objects.get_or_create(
                word=f'word_{i+1}',
                defaults={
                    'meaning': f'Meaning {i+1}',
                    'level': a1_level,
                    'part_of_speech': 'noun',
                    'example_sentence': f'This is example {i+1}.',
                }
            )
            vocab.topics.add(greetings)
        self.stdout.write('  Created 100 vocabulary words')

    def create_sentences(self):
        """Create sentence structures"""
        a1_level = Level.objects.get(code='A1')
        for i in range(10):
            SentenceStructure.objects.get_or_create(
                pattern=f'Pattern {i+1}',
                defaults={
                    'formula': 'S + V + O',
                    'description': f'Sentence pattern {i+1}',
                    'difficulty': 1,
                    'example_sentence': 'I run every day.',
                    'level': a1_level,
                    'order': i,
                }
            )
        self.stdout.write('  Created 10 sentence structures')

    def create_listening_lessons(self):
        """Create 10 listening lessons"""
        a1_level = Level.objects.get(code='A1')
        for i in range(10):
            lesson, _ = AudioLesson.objects.get_or_create(
                title=f'Listening Lesson {i+1}',
                defaults={
                    'description': f'Practice listening skill {i+1}',
                    'level': a1_level,
                    'duration': timedelta(minutes=10),
                    'order': i,
                    'is_published': True,
                }
            )
            for j in range(3):
                ListeningExercise.objects.get_or_create(
                    lesson=lesson,
                    order=j,
                    defaults={
                        'question': f'Question {j+1}?',
                        'correct_answer': 'answer',
                        'exercise_type': 'multiple_choice',
                    }
                )
        self.stdout.write('  Created 10 listening lessons')

    def create_reading_lessons(self):
        """Create 10 reading lessons"""
        a1_level = Level.objects.get(code='A1')
        for i in range(10):
            lesson, _ = ReadingLesson.objects.get_or_create(
                title=f'Reading Lesson {i+1}',
                defaults={
                    'description': f'Practice reading {i+1}',
                    'content': f'Content for reading lesson {i+1}...',
                    'level': a1_level,
                    'order': i,
                }
            )
            ReadingParagraph.objects.get_or_create(
                lesson=lesson,
                order=0,
                defaults={'content': f'Paragraph for lesson {i+1}'}
            )
            ReadingComprehension.objects.get_or_create(
                lesson=lesson,
                order=0,
                defaults={
                    'question_text': f'What is this about?',
                    'options': {'a': 'Option A', 'b': 'Option B'},
                    'correct_answer': 'a',
                }
            )
        self.stdout.write('  Created 10 reading lessons')

    def create_quizzes(self):
        """Create 8 quizzes"""
        a1_level = Level.objects.get(code='A1')
        for i in range(8):
            quiz, _ = Quiz.objects.get_or_create(
                title=f'Quiz {i+1}',
                defaults={
                    'description': f'Test knowledge {i+1}',
                    'level': a1_level,
                    'questions_count': 5,
                }
            )
            for j in range(5):
                Question.objects.get_or_create(
                    quiz=quiz,
                    order=j,
                    defaults={
                        'question_text': f'Question {j+1}?',
                        'options': {'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D'},
                        'correct_answer': 'a',
                        'question_type': 'multiple_choice',
                    }
                )
        self.stdout.write('  Created 8 quizzes')

    def create_speaking_lessons(self):
        """Create speaking lessons"""
        a1_level = Level.objects.get(code='A1')
        for i in range(5):
            SpeakingLesson.objects.get_or_create(
                title=f'Speaking Lesson {i+1}',
                defaults={
                    'description': f'Practice speaking {i+1}',
                    'level': a1_level,
                    'order': i,
                    'duration': timedelta(minutes=5),
                    'instruction': f'Instruction {i+1}',
                }
            )
        self.stdout.write('  Created 5 speaking lessons')

    def create_flashcards(self):
        """Create flashcards"""
        a1_level = Level.objects.get(code='A1')
        student1 = Account.objects.get(username='student1')
        deck, _ = FlashcardDeck.objects.get_or_create(
            name='Default Deck',
            defaults={
                'description': 'Default vocabulary deck',
                'level': a1_level,
                'owner': student1,
            }
        )
        for i in range(50):
            Flashcard.objects.get_or_create(
                deck=deck,
                front=f'Card {i+1} Front',
                defaults={
                    'back': f'Card {i+1} Back',
                    'order': i,
                }
            )
        self.stdout.write('  Created 50 flashcards')
