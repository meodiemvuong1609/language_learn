from django.contrib import admin
from .models import FlashcardDeck, Flashcard, UserFlashcardProgress


@admin.register(FlashcardDeck)
class FlashcardDeckAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'level', 'is_public', 'cards', 'created_at']
    list_filter = ['is_public', 'level', 'created_at']
    search_fields = ['name', 'description']
    filter_horizontal = ['topics']

    @admin.display(description='Cards')
    def cards(self, obj):
        return obj.flashcards.count()


@admin.register(Flashcard)
class FlashcardAdmin(admin.ModelAdmin):
    list_display = ['front', 'deck', 'part_of_speech', 'difficulty', 'created_at']
    list_filter = ['part_of_speech', 'difficulty', 'deck']
    search_fields = ['front', 'back', 'example_sentence']


@admin.register(UserFlashcardProgress)
class UserFlashcardProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'flashcard', 'mastery_level', 'next_review', 'last_reviewed']
    list_filter = ['mastery_level', 'next_review']
    search_fields = ['user__username', 'flashcard__front']
