# ✅ Task Checklist - LanguageLearn

Checklist các task đã hoàn thành và cần thực hiện trong dự án LanguageLearn.

---

## 📊 Tổng quan

| Trạng thái | Số lượng | Phần trăm |
|-----------|---------|-----------|
| ✅ Đã hoàn thành | ~30 | ~30% |
| 🔄 Đang làm / Một phần | ~15 | ~15% |
| ⬜ Chưa làm | ~55 | ~55% |

---

## 1. 🔧 Backend (Django)

### Cấu trúc & Setup
- [x] Tạo Django project `be/`
- [x] Config settings.py (DATABASES, CORS, REST_FRAMEWORK, AUTH_USER_MODEL)
- [x] Tạo app `account` (user model, serializers, views, URLs)
- [x] Tạo app `common` (Level, Topic, Progress, UserPreference, BaseModel)
- [x] Tạo app `vocabulary` (models, serializers, views)
- [x] Tạo app `listening` (models, serializers, views)
- [x] Tạo app `speaking` (models, serializers, views)
- [x] Tạo app `reading` (models, views)
- [x] Tạo app `sentence` (models, views)
- [x] Tạo app `lesson` (models, views)
- [x] Tạo app `question` (models, views)
- [x] Tạo app `b2_storage` (Backblaze B2 storage backend)
- [x] Tạo app `general` (utility functions, firebase config)
- [x] Tạo URL routing chính `be/urls.py` với router
- [x] Tạo Docker-compose.yml + Dockerfile
- [x] Tạo `requirements.txt`
- [ ] Tạo `.env.example` (template cho các biến môi trường)

### Models
- [x] `Account` - extend AbstractUser
- [x] `Level` - CEFR levels (A1-C2)
- [x] `Topic` - Learning topics
- [x] `BaseModel` - abstract model với created/updated timestamps
- [x] `Progress` - Generic progress tracking (contenttypes)
- [x] `UserPreference` - User settings
- [x] `Vocabulary` + synonyms/antonyms (M2M self)
- [x] `VocabularyList` + `VocabularyListItem`
- [x] `UserVocabulary` - mastery_level, spaced repetition
- [x] `AudioLesson` + `ListeningExercise`
- [x] `UserListeningProgress` + `ListeningExerciseAttempt`
- [x] `SpeakingLesson` + `SpeakingExercise` + `PronunciationPattern`
- [x] `UserSpeakingProgress` + `UserSpeakingAttempt`
- [x] `ReadingLesson`
- [x] `SentenceStructure`
- [x] `Lesson` (composite)
- [x] `Question`

### Serializers
- [x] Vocabulary serializers (Vocabulary, VocabularyList, VocabularyListItem, UserVocabulary, Basic)
- [x] Listening serializers
- [x] Speaking serializers
- [x] Account serializer
- [x] Common serializers (Level, Topic)

### API Views / Endpoints
- [x] LoginView (POST /auth/login/)
- [x] GetMeView (GET /auth/me/)
- [x] LevelViewSet (CRUD)
- [x] TopicViewSet (CRUD)
- [x] ProgressViewSet (CRUD)
- [x] UserPreferenceViewSet (CRUD)
- [x] VocabularyViewSet (CRUD + by_topic, by_level, related_words actions)
- [x] VocabularyListViewSet (CRUD + add_words, remove_words)
- [x] UserVocabularyViewSet (CRUD + due_for_review, statistics, review)
- [x] AudioLessonViewSet (CRUD)
- [x] ListeningExerciseViewSet (CRUD)
- [x] UserListeningProgressViewSet (CRUD)
- [x] ListeningExerciseAttemptViewSet (CRUD)
- [x] SpeakingLessonViewSet (CRUD)
- [x] PronunciationPatternViewSet (CRUD)
- [x] SpeakingExerciseViewSet (CRUD)
- [x] UserSpeakingProgressViewSet (CRUD)
- [x] UserSpeakingAttemptViewSet (CRUD)
- [ ] RegisterView (POST /auth/register/)
- [ ] Password reset endpoints
- [ ] Email verification endpoint

### Authentication & Security
- [x] Token-based authentication (DRF)
- [x] CORS configuration
- [ ] Permission classes chi tiết hơn (IsOwner, IsAdmin, ...)
- [ ] Rate limiting (throttling)
- [ ] Input validation improvements
- [ ] File upload validation (size, type)

### Testing
- [ ] Unit tests cho models
- [ ] Unit tests cho serializers
- [ ] API integration tests
- [ ] Test coverage ≥ 70%

### DevOps
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Logging configuration
- [ ] Monitoring / Sentry
- [ ] Backup strategy

---

## 2. 📱 React Native Mobile App

### Setup & Config
- [x] Tạo Expo project
- [x] Cấu hình babel.config.js
- [x] Cấu hình tailwind.config.js + NativeWind
- [x] Cấu hình app.json
- [x] Tạo folder structure (screens/, services/, store/, assets/)

### Navigation
- [x] React Navigation setup (Native Stack)
- [x] Auth Stack (Login, Register)
- [x] App Stack (Home, Profile, Vocabulary, Sentence, Listening, Speaking, Review, Test)
- [ ] Deep linking config
- [ ] Protected route helper

### Screens
- [x] LoginScreen.js (UI hoàn chỉnh)
- [x] HomeScreen.js (dashboard: progress, streak, categories)
- [x] ProfileScreen.js (UI hoàn chỉnh)
- [ ] RegisterScreen.js
- [ ] VocabularyScreen.js
- [ ] SentenceScreen.js
- [ ] ListeningScreen.js
- [ ] SpeakingScreen.js
- [ ] ReviewScreen.js
- [ ] TestScreen.js

### Services & API
- [x] api.js (Axios instance + interceptors)
- [x] tokenService.js (AsyncStorage)
- [x] authService.js (login, logout, getCurrentUser, register)
- [x] vocabularyService.js
- [x] listeningService.js
- [x] speakingService.js
- [ ] sentenceService.js
- [ ] testService.js
- [ ] progressService.js

### State Management
- [x] Redux Toolkit store setup
- [x] userSlice.js
- [ ] vocabularySlice
- [ ] listeningSlice
- [ ] speakingSlice
- [ ] progressSlice

### Components
- [ ] Reusable Button component
- [ ] Reusable Input component
- [ ] Reusable Card component
- [ ] Reusable Badge/BadgeList component
- [ ] Toast message component
- [ ] Loading spinner component
- [ ] Empty state component
- [ ] Error state component

### Features
- [ ] Audio playback (expo-av)
- [ ] Audio recording (expo-av)
- [ ] Push notifications (expo-notifications)
- [ ] Offline caching
- [ ] Biometric auth (expo-local-authentication)
- [ ] Image picker / camera
- [ ] Share functionality

### Testing
- [ ] Unit tests (Jest)
- [ ] Component tests
- [ ] E2E tests (Detox)

### DevOps
- [ ] EAS Build setup
- [ ] EAS Submit (App Store / Play Store)
- [ ] Over-the-air updates
- [ ] Crash reporting (Sentry / Firebase Crashlytics)

---

## 3. 🌐 Next.js Web Frontend

### Setup & Config
- [x] Tạo Next.js 15 project (Pages Router)
- [x] Cấu hình tailwind.config.js + PostCSS
- [x] Cấu hình jsconfig.json (path aliases)
- [x] Redux store setup
- [x] Axios instance với request interceptor

### Pages
- [x] `_app.js` - Root layout + Redux Provider
- [x] `home/index.js` - Landing page
- [x] `login/index.js` - Login page
- [ ] `register/index.js` - Register page
- [ ] `dashboard/index.js` - User dashboard
- [ ] `vocabulary/index.js` - Vocabulary page
- [ ] `listening/index.js` - Listening page
- [ ] `speaking/index.js` - Speaking page
- [ ] `sentence/index.js` - Sentence/Grammar page
- [ ] `review/index.js` - Review page
- [ ] `test/index.js` - Test page
- [ ] `profile/index.js` - Profile page

### Components
- [x] Header.js
- [x] Footer.js
- [x] LoginForm.js
- [x] Layout.js
- [x] DefaultLayout.js
- [ ] ProtectedRoute (HOC - redirect nếu chưa auth)
- [ ] Button component
- [ ] Input component
- [ ] Card component
- [ ] Badge component
- [ ] Modal component
- [ ] Toast/Snackbar component
- [ ] Skeleton loader
- [ ] Pagination component

### State Management
- [x] authSlice.js (login, getMe, logout)
- [ ] vocabularySlice
- [ ] listeningSlice
- [ ] speakingSlice
- [ ] progressSlice

### Features
- [ ] Form validation (react-hook-form + zod)
- [ ] Global error boundary
- [ ] Toast notification system
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Dark mode toggle
- [ ] Internationalization (i18n)

### Testing
- [ ] Unit tests (Jest + RTL)
- [ ] Integration tests
- [ ] E2E tests (Playwright / Cypress)

### DevOps
- [ ] CI/CD (Vercel deployment)
- [ ] Environment config (Vercel env vars)
- [ ] Analytics (Google Analytics / Plausible)

---

## 4. 🎨 Design & Documentation

- [x] Tạo DESIGN_SYSTEM.md
  - [x] Color palette (primary, secondary, semantic, neutrals)
  - [x] Typography (type scale, usage)
  - [x] Spacing rules
  - [x] Border radius
  - [x] Shadows
  - [x] Component specs (Button, Input, Card, List)
  - [x] Icon guidelines
  - [x] Layout principles (mobile vs web)
  - [x] Dark mode palette
  - [x] Animation guidelines
  - [x] Empty/Error/Loading states
  - [x] Accessibility rules
- [x] Tạo CODING_STANDARDS.md
  - [x] General principles
  - [x] Backend conventions (Python/Django)
  - [x] Frontend conventions (React)
  - [x] Git workflow
  - [x] Security rules
  - [x] Testing guidelines
  - [x] Code review checklist
- [x] Tạo README.md cho từng project
  - [x] Root README.md
  - [x] languagelearnbe/README.md
  - [x] languagelearn/README.md
  - [x] languagelearnfe/README.md
- [ ] Brand guidelines (logo usage, brand colors locked)
- [ ] Figma / design files (nếu dùng Figma)

---

## 5. 🚀 Deployment & Infrastructure

- [ ] Backend deployment (Render / Railway / AWS / GCP)
- [ ] Database hosting (managed PostgreSQL)
- [ ] Backblaze B2 bucket setup
- [ ] CDN cho static files
- [ ] Mobile app CI/CD (EAS)
- [ ] Web app deployment (Vercel / Netlify)
- [ ] Domain + SSL certificates
- [ ] Environment variables management
- [ ] Backup & disaster recovery plan

---

## 6. 📋 Product Features (User-facing)

### Core Learning Features
- [ ] Vocabulary - Browse, search, filter (by level/topic)
- [ ] Vocabulary - Add to favorites
- [ ] Vocabulary - Spaced repetition review flow
- [ ] Vocabulary - Create custom vocabulary lists
- [ ] Vocabulary - Practice mode (flashcard style)
- [ ] Listening - Play audio lessons
- [ ] Listening - Transcript display + translation
- [ ] Listening - Interactive exercises (multiple choice, fill blank, dictation)
- [ ] Listening - Progress tracking
- [ ] Speaking - Record audio responses
- [ ] Speaking - AI pronunciation scoring (cần tích hợp AI service)
- [ ] Speaking - Phonetics practice
- [ ] Speaking - Role-play exercises
- [ ] Reading - Read lessons by level/topic
- [ ] Reading - Comprehension questions
- [ ] Sentence - Grammar structures
- [ ] Sentence - Example sentences
- [ ] Review - SRS review of due items
- [ ] Review - Wrong answers practice
- [ ] Test - Create/assign tests
- [ ] Test - Auto-grading

### User Features
- [ ] Registration with email verification
- [ ] Login / Logout
- [ ] Forgot password / Reset password
- [ ] Social login (Google, Facebook, Apple)
- [ ] Profile management (avatar, name, settings)
- [ ] Learning preferences (daily goal, preferred level/topic)
- [ ] Daily streak tracking
- [ ] Achievement badges
- [ ] Learning statistics dashboard
- [ ] Notification settings
- [ ] Push notifications (study reminders, achievements)
- [ ] Offline mode (download lessons)

### Admin Features
- [ ] Admin panel (Django admin)
- [ ] Content management (CRUD lessons, vocab, exercises)
- [ ] User management
- [ ] Analytics dashboard
- [ ] Bulk import content (CSV/JSON)

---

## 🎯 Priority Matrix

### P0 - Critical (Must Have)
1. Register endpoint + Register screen
2. Password reset flow
3. Tất cả screens implement đầy đủ
4. Protected routes
5. Vector icon style thống nhất giữa mobile và web
6. Color brand thống nhất (chuyển mobile sang blue)

### P1 - High Priority
1. Form validation
2. Error handling / toast toàn app
3. Protected route helper
4. Responsive web design
5. Reusable components (Button, Input, Card)
6. File upload validation backend
7. Pagination cho API

### P2 - Medium Priority
1. Dark mode
2. Offline mode
3. Audio recording (speaking)
4. Push notifications
5. Unit tests
6. CI/CD

### P3 - Low Priority / Nice to Have
1. Social login
2. Biometric auth
3. Deep linking
4. Analytics
5. A/B testing
6. Recommendation engine

---

## 📅 Timeline Gợi ý

### Sprint 1 (2 tuần) - Core
- Register backend + frontend
- Password reset
- Hoàn thiện 5 screens đầu (Home, Profile, Vocabulary, Listening, Test)

### Sprint 2 (2 tuần) - Remaining Screens
- Speaking screen + audio recording
- Review screen
- Sentence screen
- Form validation + error handling

### Sprint 3 (2 tuần) - Polish
- Reusable components
- Responsive design
- Dark mode
- Unit tests

### Sprint 4 (2 tuần) - Launch Prep
- CI/CD setup
- Deployment
- Testing QA
- Bug fixes
