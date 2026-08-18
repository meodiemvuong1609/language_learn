# LanguageLearn Backend — Django REST API

## 🚀 Quick Start

```bash
cd languagelearnbe
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Chỉnh .env: DATABASE_URL, SECRET_KEY, v.v.
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
# → http://localhost:8000
# Swagger: http://localhost:8000/swagger/
```

## 🎯 Seed Data (Dữ liệu mẫu)

Để tạo dữ liệu mẫu cho hệ thống, chạy lệnh:

```bash
# Tạo dữ liệu mẫu (xóa dữ liệu cũ nếu có)
python manage.py seed_data --clean

# Hoặc chỉ thêm dữ liệu mới (không xóa)
python manage.py seed_data
```

### 📊 Dữ liệu được tạo:

- **5 users**: student1, student2, student3, student4, student5 (mật khẩu: `Student123!`)
- **100 từ vựng** (Vocabulary)
- **10 bài nghe** (Audio Lessons) với 30 bài tập
- **10 bài đọc** (Reading Lessons) với đoạn văn và câu hỏi
- **8 bài quiz** với 40 câu hỏi
- **5 bài nói** (Speaking Lessons)
- **10 cấu trúc câu** (Sentence Structures)
- **50 flashcards** trong 1 deck
- **5 Levels** (A1, A2, B1, B2, C1)
- **10 Topics** (Greetings, Family, Food, Travel, Work, Education, Health, Technology, Environment, Culture)

### 🧪 Kiểm tra dữ liệu

```bash
# Kiểm tra số lượng records
python manage.py shell -c "
from account.models import Account
from vocabulary.models import Vocabulary
from listening.models import AudioLesson
from reading.models import ReadingLesson
from question.models import Quiz

print(f'Users: {Account.objects.count()}')
print(f'Vocabulary: {Vocabulary.objects.count()}')
print(f'Listening Lessons: {AudioLesson.objects.count()}')
print(f'Reading Lessons: {ReadingLesson.objects.count()}')
print(f'Quizzes: {Quiz.objects.count()}')
"
```

## 📁 Cấu trúc

```
languagelearnbe/
├── account/             # Auth: register, login, forgot/reset password
├── common/              # Level, Topic, Progress, UserPreference
├── vocabulary/          # Từ vựng: lessons, lists, user-vocabulary (SRS)
├── listening/           # Nghe: audio lessons, exercises, progress
├── speaking/            # Nói: lessons, exercises, attempts
├── sentence/            # Ngữ pháp: sentence structures
├── reading/             # Đọc hiểu: lessons, paragraphs, comprehension
├── question/            # Quiz: quizzes, questions, attempts
├── be/                  # Project config: settings, urls, wsgi
├── b2_storage/          # Backblaze B2 file storage
├── docs/                # Design & coding docs
├── requirements.txt     # Dependencies
├── Dockerfile           # Docker build
├── Docker-compose.yml   # Docker orchestration
└── readme_test.md       # Hướng dẫn chạy test
```

## 🔑 API Endpoints

| Module | URL | Mô tả |
|--------|-----|-------|
| Auth | `/api/auth/register/` | Đăng ký |
| Auth | `/api/auth/login/` | Đăng nhập (Token) |
| Auth | `/api/auth/me/` | Thông tin user hiện tại |
| Auth | `/api/auth/forgot-password/` | Quên mật khẩu |
| Auth | `/api/auth/reset-password/` | Đặt lại mật khẩu |
| Levels | `/api/levels/` | Danh sách trình độ |
| Topics | `/api/topics/` | Chủ đề |
| Vocabulary | `/api/vocabulary/` | Từ vựng (CRUD, search, filter) |
| Vocabulary | `/api/vocabulary/by_topic/` | Lọc theo topic |
| Vocabulary | `/api/vocabulary/by_level/` | Lọc theo level |
| Vocabulary | `/api/vocabulary-lists/` | Danh sách từ vựng cá nhân |
| Vocabulary | `/api/user-vocabulary/` | Tiến độ từ vựng user |
| Listening | `/api/audio-lessons/` | Bài học nghe |
| Listening | `/api/listening-exercises/` | Bài tập nghe |
| Listening | `/api/listening-progress/` | Tiến độ nghe |
| Speaking | `/api/speaking-lessons/` | Bài học nói |
| Speaking | `/api/speaking-exercises/` | Bài tập nói |
| Speaking | `/api/speaking-progress/` | Tiến độ nói |
| Sentence | `/api/sentence-structures/` | Cấu trúc câu |
| Reading | `/api/reading-lessons/` | Bài đọc |
| Reading | `/api/reading-paragraphs/` | Đoạn văn |
| Reading | `/api/reading-progress/` | Tiến độ đọc |
| Quiz | `/api/quizzes/` | Quiz |
| Quiz | `/api/questions/` | Câu hỏi quiz |
| Quiz | `/api/quiz-attempts/` | Lịch sử làm quiz |
| Progress | `/api/progress/` | Tổng quan tiến độ |

## ⚙️ Tech Stack

- **Django 5.0** — Web framework
- **Django REST Framework** — REST API
- **PostgreSQL** — Database
- **Backblaze B2** — File storage (ảnh, audio)
- **Django CORS Headers** — Cross-origin support
- **DRF YASG** — Swagger/OpenAPI docs
- **Django Filter** — Advanced filtering
- **Token Auth** — Xác thực API

## 🔐 Authentication

API sử dụng **Token Authentication**. Đăng nhập để nhận token, gửi kèm header:

```
Authorization: Token <your_token>
```

## 🧪 Test Coverage

Đã fix và cải thiện test suite với **62+ tests passing**:

| Module | Tests | Status |
|--------|-------|--------|
| Account (register, login, forgot password) | 16 | ✅ Passing |
| Common (Level, Topic, Progress) | 12 | ✅ Passing |
| Reading (lessons, paragraphs, comprehension) | 14 | ✅ Passing |
| Vocabulary (words, lists, SRS review) | 20 | ✅ Passing |

### Các lỗi đã fix:

1. **Authentication Views**: Thêm HTTP status codes vào Response objects
2. **Password Reset**: Thêm Account model import
3. **Topic ViewSet**: Thêm `root_topics` và `subtopics` custom actions
4. **Reading Router**: Đăng ký missing `reading-comprehension` endpoint
5. **DurationField Fixes**: Sử dụng `timedelta()` thay vì integers cho tất cả DurationField (listening, speaking)
6. **Vocabulary Permissions**: Cho phép anonymous users xem public vocabulary lists
7. **User Reading Progress**: Thêm `perform_create` để auto-assign user
8. **Test Data**: Thêm required fields (`part_of_speech`, `duration`)

### Chạy tests:

```bash
cd languagelearnbe
python manage.py test --verbosity=2

# Hoặc chạy từng module:
python manage.py test account.tests
python manage.py test vocabulary.tests
python manage.py test reading.tests
python manage.py test common.tests
```

## 📄 License

BSD License
