# LanguageLearn — Nền tảng học tiếng Anh toàn diện

Ứng dụng học tiếng Anh tích hợp đầy đủ 6 kỹ năng: Từ vựng (SRS), Nghe, Nói (microphone), Ngữ pháp, Đọc hiểu, Quiz.

## 🏗️ Kiến trúc

```
LanguageLearn/
├── languagelearnfe/       # Next.js Web Frontend    ← bạn đang ở đây
│   ├── src/
│   │   ├── pages/         # 14 file pages (routes)
│   │   ├── components/    # Reusable UI components
│   │   ├── store/         # Redux Toolkit slices
│   │   └── services/      # API service layer
│   ├── .env.local         # API URL config
│   ├── next.config.mjs    # Next.js + API proxy
│   └── README_FRONTEND.md # Frontend docs + verification
│
├── languagelearnbe/       # Django REST API Backend
│   ├── account/           # Auth: register, login, forgot/reset password
│   ├── common/            # Level, Topic, Progress, Preference
│   ├── vocabulary/        # Từ vựng: CRUD, by_topic, by_level, SRS review
│   ├── listening/         # Nghe: audio lessons, exercises, progress
│   ├── speaking/          # Nói: lessons, exercises, attempts, progress
│   ├── sentence/          # Ngữ pháp: sentence structures, vocabulary items
│   ├── reading/           # Đọc hiểu: lessons, paragraphs, comprehension
│   ├── question/          # Quiz: quizzes, questions, attempts
│   ├── be/                # Django config: settings, urls, wsgi
│   ├── b2_storage/        # Backblaze B2 file storage
│   ├── docs/              # Design & coding standards
│   ├── readme_test.md     # Hướng dẫn chạy test
│   └── requirements.txt   # Python dependencies
│
├── languagelearn/         # React Native Mobile App (Expo)
│   ├── App.js
│   ├── screens/
│   ├── services/
│   └── store/
│
└── docs/                  # Root-level documentation
    ├── VERIFICATION.md    # End-to-end verification checklist BE+FE
    ├── DESIGN_SYSTEM.md   # UI/UX design tokens
    ├── CODING_STANDARDS.md # Code conventions
    └── TASK_CHECKLIST.md  # Task tracking
```

## 📊 Tech Stack

| Layer | Technology |
|--------|-----------|
| **Backend** | Django 5.0, DRF, PostgreSQL, B2 Storage, JWT/Tokken Auth |
| **Frontend Web** | Next.js 14, React 18, Tailwind CSS, Redux Toolkit, Axios |
| **Mobile** | React Native / Expo |
| **Testing** | Django Test, APIClient, Coverage |
| **Docs** | Swagger/OpenAPI, Markdown |
| **DevOps** | Docker, Docker Compose |

## 🚀 Quick Start

### Backend (`languagelearnbe/`)

```bash
cd languagelearnbe
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver          # http://localhost:8000
python manage.py test --verbosity=2 # Chạy 150+ test cases
```

### Frontend Web (`languagelearnfe/`)

```bash
cd languagelearnfe
npm install
npm run dev                         # http://localhost:3001
```

## 📄 Tính năng chính

### 🔐 Auth & User
- Đăng ký / Đăng nhập / Quên mật khẩu / Reset mật khẩu
- JWT Token authentication
- Profile management (edit full_name, email, phone, birthday)
- User preferences tracking

### 📚 Vocabulary (Từ vựng)
- Browse vocabulary với filter theo level/topic
- Search real-time
- Pagination (12 cards/page)
- **Flashcard SRS review** (`/vocabulary/review`): flip, rate (đã nhớ/chưa nhớ), stats
- UserVocabulary tracking: spaced repetition, due_for_review, statistics

### 🎧 Listening (Nghe)
- Audio lesson catalog với filter level
- Audio player với transcript
- Listening exercises (multiple choice)
- Progress tracking + favorites

### 🎤 Speaking (Nói)
- Speaking lesson catalog
- Pronunciation patterns reference
- **Microphone recording** (`/speaking/[id]`): MediaRecorder API, record/playback
- Mock AI scoring với feedback

### ✍️ Sentence (Ngữ pháp)
- Sentence structures catalog (formula + description + example)
- Filter theo difficulty/level
- **Detail page** (`/sentence/[id]`): vocabulary items + fill-in-the-blank exercise

### 📖 Reading (Đọc hiểu)
- Reading lesson catalog với filter level
- Multi-paragraph content + translations
- **Comprehension questions** (`/reading/[id]`): multiple choice, timmed, scored

### 📝 Quiz (Trắc nghiệm)
- Quiz catalog: questions_count, time_limit, passing_score
- **Quiz taking** (`/quizzes/[id]`): full exam experience
  - Countdown timer (mm:ss)
  - Progress bar
  - Auto-submit when time runs out
  - Review answers (yours vs correct + explanation)
  - Retake option
- Score history (UserQuizAttempt) với breakdown

### 📊 Dashboard
- 4 stat cards: Vocabulary, Listening, Speaking, Quiz
- Recent activity feed
- Quick action shortcuts

## 📁 API Endpoints (50+)

```
/api/auth/               # Register, login, me, logout, forgot/reset password
/api/levels/             # CEFR levels (A1, A2, B1...)
/api/topics/             # Learning topics
/api/vocabulary/         # Words CRUD, search, by_topic, by_level
/api/vocabulary-lists/   # Personal vocabulary lists
/api/user-vocabulary/    # SRS progress
/api/audio-lessons/      # Listening lessons
/api/listening-exercises/# Listening exercises
/api/listening-progress/ # Listening progress
/api/speaking-lessons/   # Speaking lessons
/api/pronunciation-patterns/
/api/speaking-exercises/ # Speaking exercises
/api/speaking-progress/  # Speaking progress
/api/sentence-structures/# Grammar structures
/api/reading-lessons/    # Reading lessons
/api/reading-paragraphs/ # Lesson paragraphs
/api/reading-comprehension/
/api/reading-progress/   # Reading progress
/api/quizzes/            # Quizzes
/api/questions/          # Quiz questions
/api/quiz-attempts/      # Quiz history
/api/progress/           # Overall progress
/api/preferences/        # User preferences
```

## 🧪 Testing

- **150+ test cases** across 8 Django apps
- Coverage targets: Account ≥90%, others ≥80%
- Run: `python manage.py test --verbosity=2`
- See `languagelearnbe/readme_test.md` for full testing guide

## 📚 Documentation

| File | Mô tả |
|------|-------|
| `docs/VERIFICATION.md` | Checklist kiểm thử toàn diện BE + FE |
| `languagelearnfe/README_FRONTEND.md` | Frontend: setup + 15-section feature checklist |
| `languagelearnbe/readme_test.md` | Backend: test guide, coverage, per-app commands |
| `languagelearnbe/README.md` | Backend API docs, endpoints table |
| `docs/DESIGN_SYSTEM.md` | UI/UX design tokens |
| `docs/CODING_STANDARDS.md` | Code conventions |
| `docs/TASK_CHECKLIST.md` | Feature tracking |

## 🗺️ Frontend Routes (15 pages)

```
/                    Home (landing)
/login               Login
/register            Register
/dashboard           Dashboard (protected)
/vocabulary          Vocabulary list (protected)
/vocabulary/review   Flashcard SRS review (protected)
/listening           Listening catalog (protected)
/listening/[id]      Audio player + exercises (protected)
/speaking            Speaking catalog (protected)
/speaking/[id]       Microphone recording + patterns (protected)
/sentence            Sentence structures (protected)
/sentence/[id]       Detail + fill-in exercise (protected)
/reading             Reading lessons (protected)
/reading/[id]        Detail + comprehension Qs (protected)
/quizzes             Quiz list (protected)
/quizzes/[id]        Quiz taking (timer + submit + review) (protected)
/profile             User profile (protected)
*                    404 Not Found
```

## ⚙️ Environment Variables

### Backend (`languagelearnbe/.env`)
```
POSTGRES_DB=languagelearn
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
SECRET_KEY=your-secret-key
DEBUG=True
ENV_ALLOWED_HOSTS=localhost,127.0.0.1,testserver
ENV_ALLOWED_CORS=http://localhost:3001,http://localhost:3000
```

### Frontend (`languagelearnfe/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 🐳 Docker

```bash
cd languagelearnbe
docker-compose up --build
```

## 🔮 Next Steps (Roadmap)

- [ ] Real AI scoring for speaking (Whisper / Google Speech API)
- [ ] Custom audio player with waveform
- [ ] WebSocket notifications
- [ ] Vocabulary detail page + favorites
- [ ] Toast notifications (replace alert)
- [ ] Dark mode
- [ ] i18n multi-language support
- [ ] Progressive Web App (PWA) support
- [ ] Mobile app polish (React Native features)
- [ ] Email backend configuration (SMTP)
- [ ] File upload presigned URLs (B2)

## 👥 Team

Built with ❤️ using Django + Next.js + React Native

## 📄 License

BSD License
