# 🚀 Improvements & Recommendations - LanguageLearn

Đề xuất nâng cấp và cải tiến cho dự án LanguageLearn, phân loại theo mức độ ưu tiên.

---

## 🔴 P0 - Critical (Phải làm ngay)

### 1. Thống nhất Brand Color giữa Mobile và Web
**Hiện trạng:**
- Web app: `blue-600` (#2563EB) làm primary
- Mobile app: `red-500` (#EF4444) làm primary

**Đề xuất:** Chuyển mobile sang `blue-600` để thống nhất.
- Cần thay đổi trong `HomeScreen.js`, `LoginScreen.js`, `ProfileScreen.js`, `tailwind.config.js` (mobile)
- Tạo custom color tokens trong `tailwind.config.js` của cả 2 platforms

### 2. Register endpoint + Flow hoàn chỉnh
**Hiện trạng:** BE chưa có `RegisterView`, mobile có `RegisterScreen` nhưng không kết nối API.

**Đề xuất:**
```
Backend:
- Tạo RegisterView (POST /auth/register/)
- Validate password strength
- Gửi email verification
- Return token sau khi register

Mobile:
- Connect RegisterScreen với API
- Form validation (password match, min length)
- Toast feedback

Web:
- Tạo register page
- Tạo ProtectedRoute HOC
```

### 3. Password Reset Flow
**Backend:**
- `POST /auth/password-reset/` - gửi email reset link
- `POST /auth/password-reset-confirm/` - xác nhận + đổi mật khẩu

**Frontend (cả Mobile + Web):**
- Forgot password screen
- Reset password screen (với token từ email)

### 4. Protected Routes
- Mobile: Navigation guard (check token trước khi vào màn App)
- Web: `ProtectedRoute` HOC + redirect về login nếu chưa auth

### 5. Thống nhất icon libraries giữa Mobile và Web
**Hiện trạng:** Mobile dùng `@expo/vector-icons`, Web chưa có icon library.

**Đề xuất:** Web dùng `lucide-react` (feather icons, nhẹ, đẹp) hoặc tạo component `<Icon>` wrapper để dễ swap sau.

---

## 🟠 P1 - High Priority (Nên làm trong Sprint 1-2)

### 6. Reusable UI Components
Tạo shared component library để tránh lặp lại code:

```
Button (primary, secondary, outline, danger, loading, disabled)
Input (text, password, textarea + label + error)
Card (default, with image, with action)
Badge (level badge: A1, A2...)
Modal (bottom sheet mobile, centered dialog web)
Toast / Snackbar (success, error, warning, info)
Avatar (with fallback, size variants)
EmptyState (icon + title + subtitle + action)
SkeletonLoader ( shimmer effect )
ProgressBar (linear, circular)
```

### 7. Form Validation
**Mobile:** Dùng `react-hook-form` hoặc tự viết hook `useForm`
**Web:** Dùng `react-hook-form` + `zod` schema validation

```js
const schema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
});
```

### 8. Error Handling / Toast System
- Mobile: `react-native-toast-message` đã có, cần wrap thành service
- Web: Thêm `react-hot-toast` hoặc tự build Toast component với Redux

```js
// Toast types
toast.success('Đăng nhập thành công!');
toast.error('Sai mật khẩu');
toast.warning('Token sắp hết hạn');
toast.info('Đang tải dữ liệu...');
```

### 9. API Pagination
**Backend:**
```python
from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100
```

**Frontend:** Update service methods để handle paginated responses.

### 10. File Upload Validation
**Backend:**
- Validate file size: `MAX_FILE_SIZE = 10 * 1024 * 1024` (10MB)
- Validate file type/extention: `.mp3`, `.wav`, `.jpg`, `.png`
- Validate content type header
- Scan for malware (optional, dùng ClamAV)

### 11. `.env.example` Files
Tạo template files để new developer dễ setup:

```bash
# languagelearnbe/.env.example
DEBUG=True
SECRET_KEY=changeme
POSTGRES_DB=languagelearn
POSTGRES_USER=postgres
POSTGRES_PASSWORD=changeme
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
BACKBLAZEB2_APP_KEY_ID=changeme
# ...

# languagelearn/.env.example
SERVER_URL=http://localhost:8000

# languagelearnfe/.env.local.example
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🟡 P2 - Medium Priority (Sprint 2-3)

### 12. Dark Mode
**Implementation:**
- Backend: lưu preference `dark_mode` trong `UserPreference`
- Mobile: `useColorScheme()` + Redux state + NativeWind dark:
- Web: `useColorScheme()` + Tailwind `dark:` classes + localStorage

### 13. Offline Mode
**Mobile:**
- Cache data với AsyncStorage / MMKV
- Queue actions khi offline (sync khi online)
- Show offline banner

```js
// NetInfo listener
NetInfo.addEventListener(state => {
  dispatch(setOnline(state.isConnected));
});
```

**Web:**
- Service Worker (Workbox)
- Cache API responses
- Background sync

### 14. Unit Tests & Coverage

**Backend:**
```bash
pip install pytest pytest-django pytest-cov
pytest --cov=account --cov=vocabulary --cov=listening
# Target: coverage ≥ 70%
```

**Mobile:**
```bash
yarn add jest @testing-library/react-native
# Unit tests cho services, slices, utils
# Component snapshot tests
```

**Web:**
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
# Component tests, integration tests
```

### 15. Push Notifications (Firebase FCM)
**Mobile:**
```bash
expo install expo-notifications expo-device
expo install expo-build-properties  # cho bare workflow
```

**Backend:**
```python
import firebase_admin
from firebase_admin import messaging

# Gửi notification
message = messaging.Message(
    notification=messaging.Notification(
        title='Đã đến giờ học!',
        body='Bạn có 10 từ cần ôn hôm nay',
    ),
    token=user_fcm_token,
)
messaging.send(message)
```

### 16. CI/CD Pipelines

**GitHub Actions example:**
```yaml
# .github/workflows/backend.yml
name: Backend CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.11' }
      - run: pip install -r requirements.txt
      - run: pytest --cov
```

**Mobile CI:** GitHub Actions → EAS Build
**Web CI:** GitHub Actions → Vercel

### 17. Logging & Monitoring
```python
# settings.py thêm
LOGGING = {
    'version': 1,
    'handlers': {'console': {'class': 'logging.StreamHandler'}},
    'root': {'handlers': ['console'], 'level': 'INFO'},
}
```

- Integrate **Sentry** cho error tracking (BE + FE)
- Integrate **Posthog** / **Amplitude** cho product analytics

### 18. Code Splitting & Performance

**Web:**
```js
// Dynamic imports
const VocabularyScreen = dynamic(() => import('../pages/vocabulary/index'));
const HeavyChart = dynamic(() => import('../components/Chart'));
```

**Mobile:**
- Lazy load screens
- Optimize images (expo-image)
- Hermes engine enabled

---

## 🟢 P3 - Low Priority / Nice to Have

### 19. Social Login
```
Backend:
- allauth hoặc custom OAuth2 (Google, Facebook, Apple)
- Link social accounts với Account

Frontend:
- expo-auth-session (Mobile)
- next-auth (Web)
```

### 20. Biometric Authentication (Mobile)
```bash
expo install expo-local-authentication
```

### 21. Deep Linking
```
# iOS - Info.plist
URL Types: languagelearn://

# Android - AndroidManifest.xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="languagelearn" />
</intent-filter>

# Navigation linking config
const linking = {
  prefixes: ['languagelearn://'],
  config: { screens: { Vocabulary: 'vocabulary/:id' } },
};
```

### 22. Analytics
- **Google Analytics** (GA4) cho web
- **Firebase Analytics** cho mobile
- Custom events: `lesson_completed`, `word_reviewed`, `speaking_attempt`

### 23. A/B Testing
- Feature flags (Firebase Remote Config)
- Test variations của UI, copy text

### 24. Recommendation Engine
- Đề xuất từ vựng dựa trên lịch sử học
- Đề xuất bài học phù hợp với level
- Đề xuất chủ đề theo interest

### 25. Multi-language Support (i18n)
```
Mobile: react-i18next
Web:    next-i18next

Supported: vi (default), en, zh, ja, ko
```

### 26. Admin Dashboard (Web)
- Dashboard trang admin với charts (Recharts / Chart.js)
- User management table
- Content uploader (bulk import CSV)
- Analytics charts

### 27. Gamification
- Daily streak với fire animation
- Achievements / badges system
- Leaderboard (global / friends)
- Daily quests (e.g., "Học 20 từ hôm nay")

---

## 🔧 Technical Debt

### Backend
- [ ] Serializers còn nhiều `fields = '__all__'` → nên explicit fields
- [ ] Chưa có `select_related` / `prefetch_related` trong viewsets → có thể có N+1 query problem
- [ ] Chưa có pagination cho list endpoints
- [ ] `created_by` / `updated_by` chưa được set tự động (hiện chỉ có field)
- [ ] Password hashing có thể cải thiện (thêm Argon2)
- [ ] `AccountSerializer` trả `__all__` → expose password field? Cần filter

### Frontend (Mobile)
- [ ] `HomeScreen` hardcoded data streak = 7, progress = 75% → cần fetch từ API
- [ ] `authService.login` check `response.data.code` nhưng backend trả `token.key` trực tiếp
- [ ] Chưa có loading states cho màn hình
- [ ] Chưa handle error states
- [ ] Thiếu `onError` handler trong NavigationContainer

### Frontend (Web)
- [ ] `axios.js` thiếu response interceptor (error handling / refresh token)
- [ ] `getMe()` gọi lại mỗi khi Header mount → nên cache
- [ ] Chưa có error boundary
- [ ] Chưa có `<html lang="vi">` / meta description / OG tags
- [ ] LoginForm không có `name` attribute (accessibility)

---

## 📦 Dependency Updates to Watch

| Package | Current | Note |
|---------|---------|------|
| React Native | 0.79.2 | Stable |
| Expo SDK | 53 | Latest |
| React | 19.0.0 (rc) | Web dùng RC → nên update lên stable |
| Next.js | 15.0.1 | OK |
| Django | 5.0 | Support đến April 2025 → plan upgrade |
| PostgreSQL | - | Nên lock version trong production |

---

## 📋 Quick Wins (Làm trong 1-2 ngày)

Những việc nhỏ nhưng tạo giá trị lớn:

1. **Tạo `.env.example`** files (15 phút)
2. **Thêm `select_related`** vào 2-3 viewsets quan trọng (30 phút)
3. **Thêm `html lang` + meta SEO** vào web (15 phút)
4. **Sửa icon library web** (thêm lucide-react) (30 phút)
5. **Tạo component `<Icon />` wrapper** (1 tiếng)
6. **Thêm error boundary** vào web (30 phút)
7. **Thêm loading state** vào `authService` calls (30 phút)
8. **Hardcode → API call** cho HomeScreen stats (1 tiếng)
9. **Thêm `created_by` / `updated_by` signal** trong Django (30 phút)
10. **Chạy black + isort** trên toàn bộ backend code (5 phút)
