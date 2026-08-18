# LanguageLearn — End-to-End Verification Checklist

> Checklist toàn diện để kiểm tra backend + frontend hoạt động đúng theo yêu cầu.

---

## 0. Setup trước khi test

### Backend
```bash
cd languagelearnbe
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Sửa .env: DATABASE_URL, SECRET_KEY, ENV_ALLOWED_HOSTS=localhost,127.0.0.1,testserver
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
# → http://localhost:8000
# Swagger: http://localhost:8000/swagger/
```

### Frontend
```bash
cd languagelearnfe
npm install
npm run dev
# → http://localhost:3001
```

### Test Backend
```bash
cd languagelearnbe
python manage.py test --verbosity=2
```

---

## 1. Backend Verification

### 1.1 Auth (`/api/auth/`)
- [ ] `POST /api/auth/register/` → 201, tạo user mới
- [ ] `POST /api/auth/login/` → 200, trả về token
- [ ] `GET /api/auth/me/` → 200, trả user info (cần header `Authorization: Token <token>`)
- [ ] `POST /api/auth/logout/` → 200, xoá token
- [ ] `POST /api/auth/forgot-password/` → gửi email reset
- [ ] `POST /api/auth/reset-password/` → reset mật khẩu

### 1.2 Levels & Topics (`/api/levels/`, `/api/topics/`)
- [ ] `GET /api/levels/` → 200, danh sách A1, A2...
- [ ] `GET /api/topics/` → 200, danh sách chủ đề
- [ ] Filter, search hoạt động

### 1.3 Vocabulary (`/api/vocabulary/`)
- [ ] `GET /api/vocabulary/` → list + pagination
- [ ] `GET /api/vocabulary/?search=hello` → search
- [ ] `GET /api/vocabulary/by_topic/?topic_id=1` → filter
- [ ] `GET /api/vocabulary/by_level/?level_id=1` → filter
- [ ] CRUD với token auth

### 1.4 Listening (`/api/audio-lessons/`)
- [ ] `GET /api/audio-lessons/` → 200
- [ ] Filter by level, search
- [ ] `GET /api/audio-lessons/{id}/` → 200 (trả exercises cùng response)
- [ ] `GET /api/listening-exercises/?lesson={id}` → exercises list
- [ ] POST `submit_answer` → tính điểm

### 1.5 Speaking (`/api/speaking-lessons/`)
- [ ] CRUD + filter/search

### 1.6 Sentence (`/api/sentence-structures/`)
- [ ] `GET /api/sentence-structures/` → 200
- [ ] Search, filter

### 1.7 Reading (`/api/reading-lessons/`)
- [ ] `GET /api/reading-lessons/` → 200
- [ ] `GET /api/reading-lessons/{id}/` → trả paragraphs + comprehension_questions

### 1.8 Quiz (`/api/quizzes/`)
- [ ] `GET /api/quizzes/` → list
- [ ] `GET /api/quizzes/{id}/` → trả questions
- [ ] `POST /api/quiz-attempts/` → save attempt
- [ ] `GET /api/quiz-attempts/` → lịch sử của user hiện tại

### 1.9 Progress (`/api/progress/`, `/api/preferences/`)
- [ ] `GET /api/progress/` → tổng hợp tiến độ
- [ ] `GET /api/preferences/` → user preferences

### 1.10 Tests
- [ ] `python manage.py test --verbosity=2` → tất cả test pass
- [ ] `coverage run --source='.' manage.py test && coverage report` → coverage ≥ target

---

## 2. Frontend Verification

### 2.1 Auth Flow
- [ ] Mở `/` → hiển thị hero section + 6 tính năng
- [ ] Click "Đăng nhập" → sang `/login`
- [ ] Nhập đúng credentials → redirect `/dashboard`
- [ ] Nhập sai → hiển thị lỗi, không redirect
- [ ] Đã login → vô `/` → redirect sang `/dashboard`
- [ ] Header hiển thị username + nút "Đăng xuất"
- [ ] Click "Đăng xuất" → về `/login`, token xoá
- [ ] Chưa login → vô `/dashboard` → redirect `/login`

### 2.2 Dashboard (`/dashboard`)
- [ ] 4 stat cards: Từ vựng, Nghe, Nói, Quiz
- [ ] "Hoạt động gần đây" hiển thị data hoặc empty state
- [ ] 3 quick action cards (Từ vựng, Nghe, Quiz) → click → đúng page
- [ ] Header nav links hoạt động

### 2.3 Vocabulary (`/vocabulary`)
- [ ] Grid cards hiển thị đúng: word, meaning, phonetic, POS badge, level badge
- [ ] Search → lọc real-time
- [ ] Pagination (Trước/Sau) hoạt động
- [ ] Filter by level (nếu có)
- [ ] Click card → (nếu có link) mở detail
- [ ] `/vocabulary/review` → flashcard chạy: flip, next, stats, Làm lại

### 2.4 Listening (`/listening`)
- [ ] Grid bài học hiển thị với image placeholder, title, description
- [ ] Filter theo level dropdown
- [ ] Mỗi card: duration, level badge, "Nghe bài học" button
- [ ] Click card → `/listening/{id}`:
  - [ ] Audio player hiển thị
  - [ ] Transcript section (nếu có)
  - [ ] Bài tập: radio buttons + Nộp bài + score
  - [ ] Back link hoạt động

### 2.5 Speaking (`/speaking`)
- [ ] Grid bài học với filter level
- [ ] Mỗi card: title, description, level badge tím
- [ ] "Luyện nói" button

### 2.6 Sentence (`/sentence`)
- [ ] Grid cấu trúc câu với filter
- [ ] Mỗi card: formula (monospace), difficulty badge, description, example, translation, level badge
- [ ] Click card → `/sentence/{id}`:
  - [ ] Formula lớn + difficulty
  - [ ] Description + example + grammar notes
  - [ ] Vocabulary items grid
  - [ ] Bài tập điền từ → Nộp bài → score
  - [ ] Back link → về list

### 2.7 Reading (`/reading`)
- [ ] Grid bài đọc với filter
- [ ] Mỗi card: image, title, description, word_count, duration, level badge xanh lá
- [ ] Click card → `/reading/{id}`:
  - [ ] Title + description + meta
  - [ ] Paragraphs: readable font, leading-relaxed
  - [ ] Translation: border-left xanh, chữ nghiêng
  - [ ] Comprehension: radio options, Nộp bài, result (xanh ≥70%, vàng <70%)
  - [ ] Back link hoạt động

### 2.8 Quizzes (`/quizzes`)
- [ ] Grid quiz cards + filter level
- [ ] Mỗi card: title, questions_count, time_limit, passing_score, level badge cam
- [ ] Click card → `/quizzes/{id}`:
  - [ ] Landing: stats grid + "Bắt đầu"
  - [ ] Quiz: timer mm:ss, progress bar, questions render
  - [ ] Radio answers, progress bar cập nhật
  - [ ] Hết giờ → auto-submit
  - [ ] Submit → score + %, passed/failed
  - [ ] Review answers: yours, correct, explanation
  - [ ] "Làm lại" + "Làm quiz khác" hoạt động

### 2.9 Profile (`/profile`)
- [ ] Avatar + fullname/username
- [ ] Click "Chỉnh sửa" → fields thành input
- [ ] Sửa giá trị → "Lưu" → PATCH API → success message
- [ ] "Hủy" → khôi phục giá trị
- [ ] Settings JSON + joined date hiển thị

### 2.10 Error Pages
- [ ] Vô `/page-khong-ton-tai` → 404 page hiển thị + "Quay về trang chủ" hoạt động

### 2.11 Header & Navigation
- [ ] Logo LanguageLearn → về `/`
- [ ] Nav: Dashboard, Từ vựng, Nghe, Nói, Quiz
- [ ] Chưa login: Đăng nhập + Đăng ký
- [ ] Đã login: user + Đăng xuất
- [ ] Logout → về `/login`

### 2.12 Responsive
- [ ] Desktop (≥1024px): Grid 3-4 cột
- [ ] Tablet (768-1023px): Grid 2 cột
- [ ] Mobile (<768px): Grid 1 cột
- [ ] Cards, buttons hover effects

---

## 3. Known Limitations / Next Steps

### Backend
- [ ] Speaking `submit_attempt` chưa tích hợp AI scoring thực (mock scoring)
- [ ] Email backend chưa cấu hình (forgot password gửi email)
- [ ] File upload chưa tích hợp presigned URL từ B2

### Frontend
- [ ] Listening player chưa có custom controls (player đang dùng native `<audio>`)
- [ ] Speaking record page chưa có microphone access (chỉ có lesson list)
- [ ] Vocabulary detail page chưa có (chỉ có list + review)
- [ ] Real-time updates (WebSocket) chưa có
- [ ] Notification system chưa có

### Could be improved
- [ ] Reusable `vocabularySlice.js`, `listeningSlice.js`, etc. trong Redux (hiện dùng fetch trực tiếp)
- [ ] Form validation library (Zod/Yup)
- [ ] Toast notification thay vì alert
- [ ] Dark mode
- [ ] i18n đa ngôn ngữ

---

## 4. Run Commands Summary

```bash
# ── Backend ──────────────────────────────────────────
cd languagelearnbe
python manage.py runserver          # Dev server :8000
python manage.py test               # Chạy test
python manage.py test --verbosity=2 # Chi tiết
coverage run --source='.' manage.py test && coverage report  # Coverage

# ── Frontend ─────────────────────────────────────────
cd languagelearnfe
npm run dev                         # Dev server :3001
npm run build                       # Production build
npm start                           # Serve production

# ── Docker (nếu cần) ─────────────────────────────────
cd languagelearnbe
docker-compose up --build
```
