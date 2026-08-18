# Hướng dẫn chạy & kiểm thử Frontend — LanguageLearn Web

## 1. Cài đặt

```bash
cd /Users/maclion/Documents/Code/Me/languagelearnfe
npm install
# hoặc yarn install
```

## 2. Cấu hình

File `.env.local` đã có sẵn:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 3. Chạy development server

```bash
npm run dev
# Mở http://localhost:3001
```

## 4. Checklist kiểm thử (Feature Verification)

### A. Auth Flow
- [ ] **Home page** (`/`): Hiển thị hero + 6 tính năng + buttons Đăng nhập / Đăng ký
- [ ] **Login** (`/login`): Nhập đúng username/password → redirect đến `/dashboard`
- [ ] **Login sai**: Hiển thị lỗi, không redirect
- [ ] **Redirect khi đã login**: Vào `/` → tự redirect sang `/dashboard`
- [ ] **Header khi login**: Hiển thị username + nút Đăng xuất
- [ ] **Logout**: Click Đăng xuất → về `/login`, token bị xoá
- [ ] **ProtectedRoute**: Vào trang cần auth mà chưa login → redirect về `/login`

### B. Dashboard (`/dashboard`)
- [ ] Load được 4 stat cards (Từ vựng, Nghe, Nói, Quiz)
- [ ] Hiển thị section "Hoạt động gần đây"
- [ ] Quick Actions: 3 cards (Từ vựng, Nghe, Quiz) → click được về trang tương ứng
- [ ] Nếu chưa có data → hiển thị "Chưa có hoạt động nào"

### C. Vocabulary (`/vocabulary`)
- [ ] Hiển thị grid từ vựng (cards)
- [ ] Mỗi card: word, meaning, phonetic (nếu có), part of speech badge, level badge
- [ ] Search: Nhập "hello" → lọc đúng, nhấn Enter hoặc đợi debounce → cập nhật kết quả
- [ ] Search không có kết quả → hiển thị "Không tìm thấy từ vựng"
- [ ] Pagination: Nếu > 12 items → hiển thị nút Trước/Sau, số trang
- [ ] Click audio icon (nếu có audio)
- [ ] Level badge hiển thị đúng code (A1, A2...)

### D. Listening (`/listening`)
- [ ] Hiển thị grid bài nghe
- [ ] Filter theo level: Chọn level → lọc đúng bài học
- [ ] Mỗi card: title, description (cắt 2 dòng), duration (format mm:ss)
- [ ] Level badge màu xanh
- [ ] "Chưa có bài học nào" khi rỗng
- [ ] Click "Nghe bài học" → (chưa có player chi tiết, document behavior)

### E. Speaking (`/speaking`)
- [ ] Hiển thị grid bài nói
- [ ] Filter theo level hoạt động
- [ ] Mỗi card: title, description, level badge màu tím
- [ ] Icon 🎙️
- [ ] Click "Luyện nói" → (chưa có record page)

### F. Sentence (`/sentence`)
- [ ] Hiển thị grid cấu trúc câu
- [ ] Filter theo level
- [ ] Mỗi card: formula (monospace), description, difficulty badge, level badge
- [ ] Nếu có example_sentence → hiển thị trong box xám
- [ ] Translation hiển thị nghiêng bên dưới example

### G. Sentence Detail (`/sentence/[id]`)
- [ ] Click vào card (nếu có link) → mở trang chi tiết
- [ ] Hiển thị formula lớn + difficulty badge
- [ ] Description + example sentence + translation
- [ ] Grammar notes section (nếu có)
- [ ] Vocabulary items trong câu: grid 2 cột, word + POS + meaning
- [ ] Bài tập "Điền từ": render input với blank
- [ ] Nộp bài → hiển thị kết quả (correct/total, %)
- [ ] Back link → về `/sentence`

### H. Reading (`/reading`)
- [ ] Hiển thị grid bài đọc
- [ ] Filter theo level
- [ ] Mỗi card: image (nếu có), title, description, word_count, estimated_duration, level badge xanh lá
- [ ] "Chưa có bài đọc nào" khi rỗng

### I. Reading Detail (`/reading/[id]`)
- [ ] Title lớn + description
- [ ] Meta: word_count, duration, level badge
- [ ] Paragraphs: content lớn, readable font, leading-relaxed
- [ ] Translation: border-left xanh, chữ nghiêng
- [ ] Comprehension questions: render đúng tất cả câu + options (a/b/c/d)
- [ ] Radio button chọn đáp án → lưu vào state
- [ ] Button "Nộp bài" disabled khi chưa chọn hết
- [ ] Sau khi nộp: hiển thị kết quả + % (xanh nếu >=70%, vàng nếu <70%)
- [ ] Nút disabled sau khi submit (không click lại)

### J. Quizzes (`/quizzes`)
- [ ] Hiển thị grid quiz cards
- [ ] Filter theo level
- [ ] Mỗi card: title, description, questions_count, time_limit, passing_score, level badge cam
- [ ] "Chưa có quiz nào" khi rỗng

### K. Quiz Taking (`/quizzes/[id]`)
- [ ] **Landing**: title, description, stats grid (questions, time, passing_score, level)
- [ ] Click "Bắt đầu làm bài" → chuyển sang quiz view
- [ ] **Quiz view**: timer đếm ngược (format mm:ss), progress bar, tất cả câu hỏi
- [ ] Radio button chọn → state lưu answers, progress bar cập nhật
- [ ] Hết giờ → auto-submit
- [ ] Submit: tính điểm, hiển thị % so với passing_score
- [ ] Passed: nền xanh + 🎉
- [ ] Failed: nền vàng + 💪
- [ ] Review answers: mỗi câu hiển thị đáp án user + đáp án đúng + explanation
- [ ] "Làm lại" button → reset state, quay về landing
- [ ] "Làm quiz khác" → về `/quizzes`

### L. Vocabulary Review (`/vocabulary/review`)
- [ ] Load 20 cards từ API
- [ ] Flashcard: front (word + phonetic + POS), click để flip
- [ ] Back (meaning + example), click để flip lại
- [ ] Counter: 1/20, progress bar
- [ ] "Chưa nhớ" → đỏ, "Đã nhớ" → xanh
- [ ] Click → chuyển sang thẻ tiếp theo
- [ ] Sau 20 thẻ → màn hình kết quả (total, correct, incorrect, %)
- [ ] "Làm lại" → reset về thẻ 1

### M. Profile (`/profile`)
- [ ] Hiển thị avatar (hoặc default 👤)
- [ ] Hiển thị full_name, username, fields
- [ ] Click "Chỉnh sửa" → fields thành input
- [ ] Đổi giá trị → click "Lưu" → gọi PATCH `/api/auth/me/`
- [ ] Success message (xanh) hoặc error (đỏ)
- [ ] Click "Hủy" → khôi phục giá trị gốc
- [ ] Settings JSON render readable
- [ ] Ngày tham gia format tiếng Việt

### N. Header
- [ ] Logo click → về `/`
- [ ] Nav links: Dashboard, Từ vựng, Nghe, Nói, Quiz
- [ ] Khi chưa login: Đăng nhập + Đăng ký buttons
- [ ] Khi đã login: Xin chào, user + Đăng xuất button
- [ ] Click Đăng xuất → dispatch logout + về `/login`

### O. Responsive & UI
- [ ] Màn hình lớn (≥1024px): Grid 3-4 cột
- [ ] Tablet (768-1023px): Grid 2 cột
- [ ] Mobile (<768px): Grid 1 cột, hamburger or stacked
- [ ] Loading states có skeleton hoặc spinner
- [ ] Error states có message rõ ràng
- [ ] Empty states có illustration/icon + message
- [ ] Hover effects trên cards, buttons

## 5. Cấu trúc pages

```
languagelearnfe/src/pages/
├── home/
│   └── index.js              # Landing page
├── login/
│   └── index.js              # Login form
├── register/
│   └── index.js              # Register form
├── dashboard/
│   └── index.js              # Dashboard (stats + quick actions)
├── vocabulary/
│   ├── index.js              # Vocabulary list (grid + search + pagination)
│   └── review.js             # Flashcard SRS review
├── listening/
│   └── index.js              # Listening lessons (grid + filter)
├── speaking/
│   └── index.js              # Speaking lessons (grid + filter)
├── sentence/
│   ├── index.js              # Sentence structures (grid + filter)
│   └── [id].js               # Sentence detail + exercise
├── reading/
│   ├── index.js              # Reading lessons (grid + filter)
│   └── [id].js               # Reading detail + comprehension
├── quizzes/
│   ├── index.js              # Quiz list (grid + filter)
│   └── [id].js               # Quiz taking (timer + submit + result)
├── profile/
│   └── index.js              # User profile (edit)
└── _app.js                   # Root app (Redux Provider + Layout)
```

## 6. Cấu trúc components

```
languagelearnfe/src/components/
├── Header.js                 # Navbar (logo, links, auth state)
├── Footer.js                 # Footer
├── LoginForm.js              # Login form component
├── ProtectedRoute.js         # Auth guard HOC
├── ErrorBoundary.js          # React error boundary
├── LoadingIndicator.js       # Spinner component
├── ErrorState.js             # Error display component
├── EmptyState.js             # Empty state component
├── ListItem.js               # Reusable list item
├── CategorySelector.js       # Category/topic selector
└── layout/
    ├── DefaultLayout.js      # Header + main + Footer
    └── Layout.js             # Custom layout wrapper
```

## 7. Cấu trúc store (Redux)

```
languagelearnfe/src/store/
├── index.js                  # Root reducer + combineReducers
├── authSlice.js              # Token, user, login/logout/getMe
├── axios.js                  # Axios instance + token interceptor
├── vocabularySlice.js        # Vocabulary state (nếu dùng)
├── listeningSlice.js         # Listening state
├── speakingSlice.js          # Speaking state
└── progressSlice.js          # Progress tracking
```

## 8. API Service Layer

```
languagelearnfe/src/services/
└── api.js                    # Centralized API calls
                                   getLevels, getTopics
                                   getVocabularies, getVocabulary
                                   getAudioLessons
                                   getSpeakingLessons
                                   getQuizzes, getQuiz, submitQuiz
                                   getProgress, getPreferences
```

## 9. Build cho production

```bash
npm run build
npm start
# hoặc
yarn build
yarn start
```

## 10. Note

- **API Proxy**: Next.js rewrite `/api/*` → `http://localhost:8000/api/*` (configured in next.config.mjs)
- **Auth**: Token lưu trong `js-cookie` + Redux state
- **Layout pattern**: Mỗi page export `PageName.getLayout = function getLayout(page) { ... }`
- **ProtectedRoute**: Wrap page cần auth, tự redirect nếu chưa login
- **Responsive**: Sử dụng Tailwind CSS grid/flex utilities
