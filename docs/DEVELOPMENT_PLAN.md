# Kế hoạch phát triển LanguageLearn

> Tài liệu hoạch định sản phẩm & kỹ thuật.  
> Trạng thái code thực tế: [`PROJECT_STATUS.md`](../PROJECT_STATUS.md)  
> Việc ngắn hạn: [`TASK_QUEUE.md`](../TASK_QUEUE.md)  
> Cập nhật: 2026-08-16

---

## 1. Sản phẩm là gì

LanguageLearn là nền tảng học tiếng Anh **6 kỹ năng độc lập + SRS**, 3 client dùng chung một API:

| Phần | Thư mục | Stack |
|------|---------|--------|
| API | `languagelearnbe` | Django 5 + DRF Token + PostgreSQL |
| Web | `languagelearnfe` | Next.js 15 Pages Router, Redux, Axios, Tailwind |
| Mobile | `languagelearn` | Expo 53, Redux, Axios, NativeWind |

**Vòng học mục tiêu (đã có trên API):**

```
Catalog → Practice → Chấm điểm server → Lưu progress/SRS → Review / Dashboard
```

**Không làm trong giai đoạn gần:** curriculum gom bài (`lesson` app), JWT, App Router, React Query.

---

## 2. Đã có gì (inventory)

### 2.1 Auth & tài khoản

| Tính năng | API | Web | Mobile | Ghi chú |
|-----------|-----|-----|--------|---------|
| Đăng ký / đăng nhập Token | Có | Có | Có | Header `Authorization: Token …` |
| `/auth/me` GET + PATCH | Có | Có | GET (profile) | PATCH web đã nối Axios |
| Logout revoke token | Có | Có | Có | |
| Quên MK / reset MK | Có | Có trang | Chỉ quên MK | Email SMTP; nếu không cấu hình thì user không nhận mail |
| Preference `dark_mode`, `daily_goal` | `GET/PATCH /preferences/me/` | Theme + hồ sơ | Toggle hồ sơ | Dark CSS web; mobile chưa đổi NativeWind theme |

### 2.2 Sáu kỹ năng

| Kỹ năng | Dữ liệu nội dung | Vòng học | Web | Mobile |
|---------|------------------|----------|-----|--------|
| Từ vựng + SRS | `Vocabulary`, `UserVocabulary` | `review_word` | List + `/vocabulary/review` persist | List + detail + ReviewScreen |
| Flashcard SRS | Deck / card / progress | `review`, `due_for_review` | List / deck / study | List deck + study |
| Nghe | `AudioLesson` + exercises | `submit_answer` (server) | List → detail + nộp | List → lesson + nộp |
| Đọc | `ReadingLesson` + paragraphs + Q | `submit_comprehension` | List → detail + nộp | List → lesson + nộp |
| Quiz | `Quiz` + `Question` | `submit` + retake | List → làm bài + timer | List → TestDetail |
| Ngữ pháp | `SentenceStructure` + vocab items | `submit_exercise` fill-in | List → detail | List → detail |
| Nói | `SpeakingLesson` + exercise | `submit_self_score` | MediaRecorder + tự chấm | Tự chấm, **chưa ghi âm RN** |

### 2.3 Nền tảng kỹ thuật đã có

- Postgres, Docker Compose (BE), Swagger `/swagger/`
- Seed: `python manage.py seed_data [--clean]`
- CI GitHub Actions (BE tests + FE lint/typecheck/build + mobile smoke)
- Pagination PAGE_SIZE 20, `django-filter` (`?level=`, `?lesson=`)
- File field trên model (audio/ảnh) — storage B2 khi có key, không thì filesystem

### 2.4 Cố ý chưa có / chết

- App `lesson`: model + seed, **không API công khai**
- Model `SpeakingPractice`: không route
- Chấm nói AI (Whisper)
- CMS soạn nội dung cho giáo viên (chỉ Django Admin thưa)
- Thanh toán, lớp học, social, push notification thật

---

## 3. Dữ liệu lấy từ đâu

Đây là câu hỏi then chốt: **logic học đã có, nội dung học mới quyết định sản phẩm dùng được.**

```
[Nguồn nội dung] → PostgreSQL (models) → DRF /api/ → Web & Mobile
[File audio/ảnh] → FileField → B2 hoặc local media
[Tiến độ user]   → User*Progress / UserVocabulary / UserQuizAttempt
```

### 3.1 Hiện tại (dev / demo)

| Loại | Nguồn | Chất lượng |
|------|--------|------------|
| User mẫu | `seed_data`: student1–5, mk `Student123!` | Demo |
| Level / Topic | Seed: A1–C1, 10 topic | Đủ taxonomy |
| Từ vựng, quiz, đọc, nghe, nói, câu, flashcard | **Generate trong `seed_data.py`** (random / template) | **Không phải corpus thật**; bài nghe thường **không có file audio** |
| Audio / ảnh | Field trên model; seed ít hoặc không upload file | Player web hiện placeholder nếu không có URL |
| Progress / SRS | Sinh khi user ôn / nộp bài | Thật theo hành vi user |

**Cách nạp hôm nay**

1. `python manage.py seed_data --clean` — nội dung giả lập.  
2. Django Admin (`/admin/`) — nhập tay (admin chưa đăng ký đủ model).  
3. API CRUD ViewSet (cần user authenticated; chưa có role giáo viên).

### 3.2 Nguồn nên dùng khi ra sản phẩm (cần quyết định)

| Ưu tiên | Nguồn | Dùng cho | Việc kỹ thuật |
|---------|--------|----------|----------------|
| **P0 nội dung** | Soạn tay / spreadsheet → management command import CSV/JSON | Từ vựng, quiz, ngữ pháp, đọc | Schema import, validate CEFR + topic |
| **P0 media** | Ghi âm / TTS (Google/Azure/OpenAI) + Backblaze B2 | Listening `audio`, speaking `example_audio` | Pipeline upload, CDN URL |
| **P1** | Từ điển mở (nếu license cho phép): ví dụ wordlists CEFR công khai | Bổ sung vocab + phonetic | Script ETL, ghi nguồn/license trong DB |
| **P1** | Đoạn đọc graded (tự viết hoặc mua bản quyền) | Reading | Không scrape sách có bản quyền |
| **P2** | TTS cho từng từ | Vocab `audio` | Batch job |
| **P2** | Whisper (self-host hoặc API) | Chấm nói | Chỉ sau khi có audio mẫu và UX tự chấm ổn |
| **Không** | Crawl Duolingo/Quizlet/sách PDF lậu | — | Pháp lý + TOS |

Mỗi bản ghi nội dung nên có metadata: `level`, `topic`, `source`, `license`, `is_published`.

### 3.3 Dữ liệu do người dùng tạo

| Dữ liệu | Bảng | Sinh khi |
|---------|------|----------|
| Token đăng nhập | `authtoken_token` | Login |
| Hồ sơ | `account.Account` | Register / PATCH me |
| SRS từ | `UserVocabulary` | `review_word` |
| SRS flashcard | `UserFlashcardProgress` | study / review |
| Nộp nghe / đọc / quiz / câu / nói | `*Attempt` / `*Progress` | submit_* |
| Preference | `UserPreference` | `/preferences/me/` |

Không lấy progress từ client tin tưởng: **đáp án đúng chỉ so trên server.**

---

## 4. Cần update những gì (lệch & nợ)

### 4.1 Nội dung & vận hành (blocker sản phẩm)

| ID | Việc | Chi tiết |
|----|------|----------|
| C-01 | **Gói nội dung v1** | ~300 từ A1–A2, 20 bài nghe *có file*, 15 bài đọc, 10 quiz, 15 cấu trúc, 5 bài nói có audio mẫu |
| C-02 | Import CSV | Command `import_content` (vocab, questions, sentences) |
| C-03 | Media B2 | Bật B2 trên staging; seed không phụ thuộc file local |
| C-04 | Admin đầy đủ | Đăng ký ModelAdmin cho vocab/listening/reading/quiz/sentence/speaking/common |
| C-05 | `is_published` | Seed phải `True` cho bài demo; hiện nhiều lesson default `False` → list API trống |

### 4.2 Tính năng lớn (product)

| ID | Tính năng | Đã có | Cần thêm |
|----|-----------|--------|----------|
| F-01 | **Nội dung thật + CMS nhẹ** | Seed giả | Import + Admin + (sau) UI giáo viên |
| F-02 | **Nghe có audio** | Player nếu có URL | TTS/upload + mobile `expo-av` |
| F-03 | **Nói ghi âm mobile** | Self-score | `expo-av` / `expo-audio` upload attempt |
| F-04 | **Chấm nói AI** | Self-score | Whisper + rubric (sau F-03) |
| F-05 | **Streak / daily goal** | Field `daily_goal` | Đếm phút/ngày, hiện trên Home/Dashboard |
| F-06 | **Lộ trình theo level** | Filter `?level=` | Gợi ý “học tiếp” từ preference.preferred_level — **không** bật app `lesson` trừ khi đổi hướng |
| F-07 | **i18n UI** | Copy vi (lẫn en) | vi mặc định, en; không dịch nội dung bài học |
| F-08 | **Push / email học** | `notification_enabled` | Email reminder; push Expo sau |
| F-09 | **PWA web** | — | Manifest + offline catalog (sau nội dung ổn) |

### 4.3 Cần sửa / đồng bộ kỹ thuật

| ID | Việc |
|----|------|
| U-01 | Docs lệch: `PROJECT_STATUS` vẫn ghi mobile “skeleton”; README JWT; DRF 3.14 vs 3.15.2 |
| U-02 | Gộp `EmptyState` / `ErrorState` / `Toast` (`.js` vs `ui/*.tsx`) |
| U-03 | Brand: web xanh, mobile đỏ — chọn 1 token |
| U-04 | Dark mode mobile: NativeWind `dark:` theo `UserPreference` |
| U-05 | Xóa / archive `SpeakingPractice`; giữ `lesson` chỉ seed hoặc bỏ seed Lesson |
| U-06 | Role `staff` cho soạn bài; cấm học viên POST lesson |
| U-07 | Test FE/mobile thật (RTL) thay vì chỉ smoke `node --test` |
| U-08 | `b2_storage` gitignore vs `INSTALLED_APPS` — clone mới không vỡ |
| U-09 | SMTP thật cho forgot-password (prod) |

---

## 5. Lộ trình theo pha

### Pha A — Nội dung dùng được (1–2 sprint) — **ưu tiên cao nhất**

Không thêm skill mới. Làm cho 6 vòng học **có bài thật**.

1. C-05 seed `is_published=True` + duration/audio placeholder rõ.  
2. C-04 Django Admin.  
3. C-02 CSV import vocab + quiz + sentence.  
4. C-01 soạn gói A1 (tự viết, không scrape).  
5. C-03 5–10 file mp3 lên B2, gán `AudioLesson.audio`.  
6. Kiểm tra tay: web + mobile từng skill với user `student1`.

**Xong khi:** user mới học được 1 buổi 20 phút không gặp list trống / audio giả.

### Pha B — Vòng học hàng ngày (1 sprint)

1. F-05 streak + tiến độ vs `daily_goal` trên dashboard/home.  
2. F-03 ghi âm speaking mobile + lưu `UserSpeakingAttempt`.  
3. U-04 dark mode NativeWind.  
4. U-02 gộp UI web.  
5. F-08 email “từ đến hạn SRS” (cron `due_for_review`).

### Pha C — Chất lượng nói & nền tảng (sau)

1. F-04 Whisper (self-host hoặc API), điểm 0–100 + feedback text.  
2. F-07 i18n UI.  
3. F-09 PWA.  
4. U-06 CMS giáo viên (nếu có người soạn bài).  
5. Quyết định **có/không** curriculum `Lesson` (gom skill theo buổi).

### Pha D — Không làm trừ khi đổi chiến lược

- Marketplace flashcard cộng đồng  
- Live class / chat  
- Thanh toán subscription  
- Clone dataset đối thủ  

---

## 6. Chi tiết từng tính năng lớn

### 6.1 Gói nội dung & import (F-01 / C-01–C-02)

**Input:** CSV

```
word,meaning,phonetic,part_of_speech,level_code,topics,example_sentence
apple,quả táo,/ˈæp.əl/,noun,A1,Food,I eat an apple.
```

**Output:** `Vocabulary` + M2M topic + FK level.  
**Web/mobile:** không đổi UI — list API đã có.  
**Rủi ro:** license; cần cột `source`.

### 6.2 Audio listening (F-02)

**Nguồn file:** studio hoặc TTS → B2 `listening/audio/`.  
**API:** field `audio` đã có; FE dùng `<audio src>`.  
**Mobile:** thêm `expo-av` Audio.Sound.  
**Update:** seed hiện tạo lesson không file → list có bài nhưng không nghe được.

### 6.3 Speaking (F-03 → F-04)

Hiện: web MediaRecorder local blob, điểm **tự chấm** gửi `submit_self_score`.  
Tiếp: upload file vào `UserSpeakingAttempt.audio_recording`.  
Sau: job Whisper `transcription` + so với `sample_answer` (WER) → điền `pronunciation_score`.

### 6.4 Daily goal & streak (F-05)

**Nguồn:** đếm attempt/progress trong ngày vs `UserPreference.daily_goal`.  
**API mới (gợi ý):** `GET /api/progress/today/` `{ minutes, goal, streak_days }`.  
Dashboard/Home thay số đếm thô.

### 6.5 i18n (F-07)

Chỉ UI (nút, lỗi, nav). Nội dung bài học giữ tiếng Anh + nghĩa Việt trong DB.  
Không dịch `question_text` bằng i18n library.

---

## 7. Việc “update” theo repo (checklist)

### Backend `languagelearnbe`

- [ ] Seed published + có đáp án nghe/đọc/quiz nhất quán  
- [ ] Admin models  
- [ ] Import CSV  
- [ ] SMTP + B2 trên staging  
- [ ] `GET /progress/today/`  
- [ ] Staff permission trên ViewSet ghi nội dung  
- [ ] Bỏ seed `Lesson` hoặc ghi chú “không public”

### Web `languagelearnfe`

- [ ] Empty state khi catalog trống (hướng dẫn seed)  
- [ ] Audio player khi có URL; lỗi rõ khi thiếu file  
- [ ] Gộp component trùng  
- [ ] Sửa copy JWT trong README nội bộ  
- [ ] i18n (Pha C)

### Mobile `languagelearn`

- [ ] `expo-av` nghe + nói  
- [ ] Dark mode NativeWind  
- [ ] Profile không còn hàng “Thông tin / Bảo mật” chết  
- [ ] Copy còn sót tiếng Anh trên Login (social)

---

## 8. Định nghĩa xong từng pha

| Pha | Người dùng làm được |
|-----|---------------------|
| **MVP (đã xong code)** | Đăng ký → ôn SRS → nộp nghe/đọc/quiz/câu → tự chấm nói → xem dashboard — **nếu DB đã seed/publish** |
| **Pha A xong** | Buổi học 20 phút với audio + từ thật, không list rỗng |
| **Pha B xong** | Quay lại mỗi ngày (goal/streak), nói được trên điện thoại |
| **Pha C xong** | Nói có điểm máy; UI 2 ngôn ngữ |

---

## 9. Quan hệ với tài liệu khác

| File | Vai trò |
|------|---------|
| [PROJECT_STATUS.md](../PROJECT_STATUS.md) | Sự thật code *hiện tại* |
| [TASK_QUEUE.md](../TASK_QUEUE.md) | Ticket P0–P3 ngắn |
| **DEVELOPMENT_PLAN.md (file này)** | Chiến lược: nguồn data, tính năng lớn, pha |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Token UI |
| [CODING_STANDARDS.md](./CODING_STANDARDS.md) | Quy ước code |

Ticket mới lấy ID từ mục 4–5 (C-xx, F-xx, U-xx) rồi ghi vào `TASK_QUEUE.md` khi bắt đầu làm.
