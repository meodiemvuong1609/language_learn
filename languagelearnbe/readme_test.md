# Hướng dẫn chạy test — LanguageLearn Backend

## 1. Cài đặt dependencies

```bash
cd /Users/maclion/Documents/Code/Me/languagelearnbe
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
# hoặc: venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

## 2. Tạo file `.env`

```bash
cp .env.example .env
```

Chỉnh sửa `.env`:
```env
POSTGRES_DB=languagelearn
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
SECRET_KEY=your-secret-key
DEBUG=True
ENV_ALLOWED_HOSTS=localhost,127.0.0.1,testserver
ENV_ALLOWED_CORS=http://localhost:3001,http://localhost:3000
```

> **Lưu ý:** `testserver` là bắt buộc trong `ENV_ALLOWED_HOSTS` vì Django Test Client dùng domain đó.

## 3. Chạy migrations + seed dữ liệu cơ bản

```bash
cd languagelearnbe
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser --username=admin --email=admin@test.com
```

## 4. Chạy toàn bộ test suite

```bash
cd languagelearnbe
python manage.py test --verbosity=2
```

## 5. Chạy test theo app

| Module | Command |
|--------|---------|
| Account (register, login, forgot password) | `python manage.py test account.tests` |
| Common (Level, Topic) | `python manage.py test common.tests` |
| Vocabulary | `python manage.py test vocabulary.tests` |
| Listening | `python manage.py test listening.tests` |
| Speaking | `python manage.py test speaking.tests` |
| Sentence | `python manage.py test sentence.tests` |
| Reading | `python manage.py test reading.tests` |
| Question/Quiz | `python manage.py test question.tests` |

## 6. Chạy test theo class cụ thể

```bash
python manage.py test account.tests.AccountAPITest.test_register_success
python manage.py test vocabulary.tests.VocabularyViewSetTest.test_list_vocabularies
python manage.py test listening.tests.AudioLessonViewSetTest.test_list_published_lessons
```

## 7. Chạy test với coverage

```bash
pip install coverage
coverage run --source='.' manage.py test --verbosity=2
coverage report
coverage html  # htmlcov/index.html
```

## 8. Cấu trúc test

```
languagelearnbe/
├── account/tests.py          # Register ✓ Login ✓ GetMe ✓ ForgotPassword ✓ ResetPassword ✓
├── common/tests.py           # Level CRUD ✓ Topic CRUD ✓ root_topics/subtopics actions ✓
├── vocabulary/tests.py       # Vocabulary CRUD ✓ by_topic ✓ by_level ✓ related_words ✓
│                            # VocabularyLists ✓ add_words/remove_words ✓
│                            # UserVocabulary ✓ statistics ✓ due_for_review ✓ review ✓
├── listening/tests.py        # AudioLesson CRUD ✓ filter/search ✓
│                            # ListeningExercise ✓ submit_answer ✓
│                            # UserListeningProgress ✓ statistics ✓ toggle_favorite ✓
├── speaking/tests.py         # SpeakingLesson CRUD ✓ filter/search ✓
│                            # PronunciationPattern ✓ exercises action ✓
│                            # SpeakingExercise ✓ submit_attempt (multipart) ✓
│                            # UserSpeakingProgress ✓ statistics ✓
│                            # UserSpeakingAttempt ✓ evaluate ✓ invalid score ✓
├── sentence/tests.py         # SentenceStructure CRUD ✓ search ✓
├── reading/tests.py          # ReadingLesson CRUD ✓ search ✓
│                            # ReadingParagraph ✓ filter by lesson ✓ vocab inclusion ✓
│                            # ReadingComprehension CRUD ✓
│                            # UserReadingProgress ✓ isolation ✓
├── question/tests.py         # Quiz CRUD ✓ Question CRUD ✓ filter by quiz ✓
│                            # UserQuizAttempt ✓ score_breakdown ✓ isolation ✓
└── readme_test.md            # ← bạn đang đọc file này
```

## 9. Test Coverage mục tiêu

| Module | Mục tiêu coverage |
|--------|-------------------|
| Account | ≥ 90% |
| Vocabulary | ≥ 85% |
| Listening | ≥ 85% |
| Speaking | ≥ 85% |
| Sentence | ≥ 80% |
| Reading | ≥ 80% |
| Question/Quiz | ≥ 80% |
| Common | ≥ 80% |

## 10. Ghi chú kỹ thuật

- **`APIClient`** từ `rest_framework.test` — tương tác API giống như HTTP request thực
- **`force_authenticate(user=...)`** — bypass token auth trong test
- **`setUp()`** — tạo dữ liệu mẫu trước mỗi test method
- **`SimpleUploadedFile`** — mock file upload cho `submit_attempt` (speaking)
- **Timezone** — dùng `django.utils.timezone` thay vì `datetime` để tránh lỗi naive datetime
- **`testserver`** — domain mặc định của Django Test Client, phải allow trong `ALLOWED_HOSTS`
