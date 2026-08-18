"""
URL configuration for be project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers
from common.views import (
  LevelViewSet, TopicViewSet,
  ProgressViewSet, UserPreferenceViewSet,
  fixtures_test_view,
)
from vocabulary.views import (
    VocabularyViewSet, VocabularyListViewSet,
    UserVocabularyViewSet
)
from listening.views import (
    AudioLessonViewSet, ListeningExerciseViewSet,
    UserListeningProgressViewSet, ListeningExerciseAttemptViewSet
)
from speaking.views import (
    SpeakingLessonViewSet, PronunciationPatternViewSet,
    SpeakingExerciseViewSet, UserSpeakingProgressViewSet,
    UserSpeakingAttemptViewSet
)

from sentence.views import SentenceStructureViewSet
from reading.views import ReadingLessonViewSet, ReadingParagraphViewSet, ReadingComprehensionViewSet, UserReadingProgressViewSet
from question.views import QuestionViewSet, QuizViewSet, UserQuizAttemptViewSet
from flashcard.views import FlashcardDeckViewSet, FlashcardViewSet, UserFlashcardProgressViewSet
from classroom.views import (
    TeacherStudentViewSet,
    CourseViewSet,
    ClassGroupViewSet,
    ClassSessionViewSet,
    ClassroomDashboardView,
)

# Register quiz router
quiz_router = routers.DefaultRouter()
quiz_router.register(r'quizzes', QuizViewSet)
quiz_router.register(r'quiz-attempts', UserQuizAttemptViewSet, basename='quiz-attempts')

# Register reading router
reading_router = routers.DefaultRouter()
reading_router.register(r'reading-lessons', ReadingLessonViewSet)
reading_router.register(r'reading-paragraphs', ReadingParagraphViewSet)
reading_router.register(r'reading-comprehension', ReadingComprehensionViewSet)
reading_router.register(r'reading-progress', UserReadingProgressViewSet, basename='reading-progress')
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

schema_view = get_schema_view(
	openapi.Info(
		title="Language Learning API",
		default_version='v1',
		description="API documentation for Language Learning application",
		terms_of_service="https://www.google.com/policies/terms/",
		contact=openapi.Contact(email="contact@languagelearn.com"),
		license=openapi.License(name="BSD License"),
	),
	public=True,
	permission_classes=(permissions.AllowAny,),
)

# Create a router and register our viewsets with it
router = routers.DefaultRouter()

# Common app routes
router.register(r'levels', LevelViewSet)
router.register(r'topics', TopicViewSet)
router.register(r'progress', ProgressViewSet, basename='progress')
router.register(r'preferences', UserPreferenceViewSet, basename='preferences')

# Vocabulary app routes
router.register(r'vocabulary', VocabularyViewSet)
router.register(r'vocabulary-lists', VocabularyListViewSet, basename='vocabulary-lists')
router.register(r'user-vocabulary', UserVocabularyViewSet, basename='user-vocabulary')

# Listening app routes
router.register(r'audio-lessons', AudioLessonViewSet)
router.register(r'listening-exercises', ListeningExerciseViewSet)
router.register(r'listening-progress', UserListeningProgressViewSet, basename='listening-progress')
router.register(r'listening-attempts', ListeningExerciseAttemptViewSet, basename='listening-attempts')

# Speaking app routes
router.register(r'speaking-lessons', SpeakingLessonViewSet)
router.register(r'pronunciation-patterns', PronunciationPatternViewSet)
router.register(r'speaking-exercises', SpeakingExerciseViewSet)
router.register(r'speaking-progress', UserSpeakingProgressViewSet, basename='speaking-progress')
router.register(r'speaking-attempts', UserSpeakingAttemptViewSet, basename='speaking-attempts')

# Sentence app routes
router.register(r'sentence-structures', SentenceStructureViewSet)


# Question app routes
router.register(r'questions', QuestionViewSet)

# Flashcard app routes
router.register(r'flashcard-decks', FlashcardDeckViewSet, basename='flashcard-deck')
router.register(r'flashcards', FlashcardViewSet, basename='flashcard')
router.register(r'flashcard-progress', UserFlashcardProgressViewSet, basename='flashcard-progress')

router.register(r'students', TeacherStudentViewSet, basename='students')
router.register(r'courses', CourseViewSet, basename='courses')
router.register(r'class-groups', ClassGroupViewSet, basename='class-groups')
router.register(r'sessions', ClassSessionViewSet, basename='sessions')

urlpatterns = [
  path('admin/', admin.site.urls),
  path('api/', include(router.urls)),
  path('api-auth/', include('rest_framework.urls')),
  path('api/', include('account.urls')),
  # quiz_router already registers 'quizzes/' and 'quiz-attempts/' — mount without extra prefix
  path('api/', include(quiz_router.urls)),
  # reading_router already registers routes — mount under api/
  path('api/', include(reading_router.urls)),
  path('api/classroom/dashboard/', ClassroomDashboardView.as_view(), name='classroom-dashboard'),
  path('api/v1/fixtures-test/', fixtures_test_view, name='fixtures-test'),
  # Swagger URLs
  re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
  re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
  re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
