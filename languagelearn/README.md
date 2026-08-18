# LanguageLearn - React Native Mobile App

## 📋 Tổng quan

Ứng dụng mobile học tiếng Anh **LanguageLearn**, được xây dựng với **React Native** qua **Expo SDK 53**, sử dụng **Redux Toolkit** quản lý state và **NativeWind (Tailwind CSS)** để styling.

- **Framework**: Expo SDK 53 (React Native 0.79 + React 19)
- **Ngôn ngữ**: JavaScript
- **Navigation**: React Navigation v7 (Native Stack)
- **State Management**: Redux Toolkit
- **Styling**: NativeWind v4 (Tailwind CSS cho RN)
- **HTTP Client**: Axios
- **Storage**: AsyncStorage (token)
- **Notifications**: react-native-toast-message
- **Icons**: @expo/vector-icons (MaterialIcons, FontAwesome5)

---

## 📁 Cấu trúc thư mục

```
languagelearn/
├── App.js                    # Entry point, Navigation + Redux Provider
├── app.json                  # Expo config
├── babel.config.js
├── tailwind.config.js
├── package.json
├── assets/                   # Hình ảnh, icon, splash
├── screens/                  # Các màn hình chính
│   ├── HomeScreen.js         # Màn hình chính (dashboard)
│   ├── LoginScreen.js        # Đăng nhập
│   ├── RegisterScreen.js     # Đăng ký
│   ├── ProfileScreen.js      # Hồ sơ người dùng
│   ├── VocabularyScreen.js   # Học từ vựng
│   ├── SentenceScreen.js     # Ngữ pháp câu
│   ├── ListeningScreen.js    # Luyện nghe
│   ├── SpeakingScreen.js     # Luyện nói
│   ├── ReviewScreen.js       # Ôn tập
│   └── TestScreen.js         # Kiểm tra
├── services/                 # API services
│   ├── api.js                # Axios instance + interceptors
│   ├── authService.js        # Login, logout, register, getCurrentUser
│   ├── vocabularyService.js  # CRUD vocabulary API calls
│   ├── listeningService.js   # Listening API calls
│   ├── speakingService.js    # Speaking API calls
│   └── tokenService.js       # AsyncStorage token CRUD
└── store/                    # Redux store
    ├── store.js
    └── userSlice.js          # User state (currentUser)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm hoặc yarn
- Expo CLI
- iOS Simulator hoặc Android Emulator (hoặc Expo Go app)

### Bước 1: Install dependencies
```bash
cd languagelearn
yarn install
# hoặc: npm install
```

### Bước 2: Cấu hình Environment
File `.env` (sử dụng `react-native-dotenv`):
```env
SERVER_URL=http://localhost:8000
```

### Bước 3: Chạy app
```bash
# Start Expo dev server
yarn start

# Chạy trên iOS
yarn ios

# Chạy trên Android
yarn android

# Chạy trên Web
yarn web
```

---

## 📱 Screens Overview

| Screen | Route | Mô tả |
|--------|-------|-------|
| Login | `Login` | Đăng nhập |
| Register | `Register` | Đăng ký tài khoản |
| Home | `Home` | Dashboard: thống kê, streak, categories |
| Profile | `Profile` | Thông tin user, settings, logout |
| Vocabulary | `Vocabulary` | Học từ vựng, danh sách, spaced repetition |
| Sentence | `Sentence` | Cấu trúc câu, ngữ pháp |
| Listening | `Listening` | Bài học nghe + exercises |
| Speaking | `Speaking` | Luyện nói + ghi âm |
| Review | `Review` | Ôn tập từ vựng + kiến thức |
| Test | `Test` | Kiểm tra trình độ |

---

## 🏗️ Kiến trúc

```
App.js
 ├── Redux Provider (store)
 └── NavigationContainer
      └── Stack.Navigator
           ├── Auth Stack: Login, Register
           └── App Stack: Home, Profile, Vocabulary, Sentence, Listening, Speaking, Review, Test
```

### State Management (Redux)
- `userSlice`: lưu `currentUser` (null khi chưa login)
- `authService`: gọi API, lưu token vào AsyncStorage
- `tokenService`: quản lý token trong AsyncStorage

### API Flow
1. `api.js` tạo Axios instance với `baseURL` từ `.env`
2. Request interceptor: thêm `Authorization: Token <token>` vào header
3. Response interceptor: nếu 401 → xóa token → reject
4. Mỗi service file gọi `api` với methods tương ứng

---

## 📌 TODO / Improvements

- [ ] Implement Register screen fully (chưa hoàn chỉnh)
- [ ] Implement tất cả screens còn lại (Vocabulary, Sentence, Listening, Speaking, Review, Test)
- [ ] Add forgot password / reset password
- [ ] Social login (Google, Facebook, Apple) - đã có UI placeholder
- [ ] Push notifications (Firebase)
- [ ] Offline mode / caching
- [ ] Audio recording cho speaking (react-native-track-player/expo-av)
- [ ] Deep linking
- [ ] Biometric authentication (Face ID, Touch ID)
- [ ] Dark mode support
- [ ] Internationalization (i18n) - app đang dùng tiếng Việt + tiếng Anh
- [ ] Error handling / toast message toàn app
- [ ] Unit tests + E2E tests (Detox)
- [ ] CI/CD với EAS
