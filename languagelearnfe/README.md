# LanguageLearnFE - Next.js Web Frontend

## 📋 Tổng quan

Frontend web cho ứng dụng học tiếng Anh **LanguageLearn**, được xây dựng với **Next.js 15** + **React 19** + **Redux Toolkit** + **Tailwind CSS**.

- **Framework**: Next.js 15 (App Router)
- **Runtime**: React 19 RC
- **Styling**: Tailwind CSS v3 + PostCSS
- **State Management**: Redux Toolkit + Redux Thunk
- **HTTP Client**: Axios (custom instance với interceptors)
- **Auth**: Token-based (DRF Token Auth), cookie storage
- **Linting**: ESLint + eslint-config-next

---

## 📁 Cấu trúc thư mục

```
languagelearnfe/
├── next.config.mjs
├── package.json
├── tailwind.config.js
├── postcss.config.mjs
├── jsconfig.json              # Path alias (@/ = src/)
├── public/                    # Static assets
│   ├── avatar-default.svg
│   └── ...
├── src/
│   ├── components/
│   │   ├── Header.js           # Header với auth state, logout
│   │   ├── Footer.js           # Footer copyright
│   │   ├── LoginForm.js        # Form đăng nhập (Redux form)
│   │   └── layout/
│   │       ├── Layout.js       # Layout có Footer
│   │       └── DefaultLayout.js # Layout có Header + Footer
│   ├── pages/
│   │   ├── _app.js             # Root layout, Redux Provider
│   │   ├── home/
│   │   │   └── index.js        # Landing page (hero + features)
│   │   └── login/
│   │       └── index.js        # Login page
│   ├── store/
│   │   ├── index.js            # Configure store
│   │   ├── authSlice.js        # Auth state + login/getMe async thunks
│   │   └── axios.js            # Axios instance với token interceptor
│   └── styles/
│       └── globals.css         # Tailwind base imports
│
├── .eslintrc.json
├── .gitignore
└── package-lock.json
```

---

## 🎨 Tech Stack & Design

### Colors (Design Token chung)
| Token | Hex | Mô tả |
|-------|-----|-------|
| Primary | `#2563EB` (blue-600) | Nút chính, links, headers |
| Primary Light | `#EFF6FF` (blue-50) | Background gradient |
| Primary Dark | `#1D4ED8` (blue-700) | Hover states |
| Secondary | `#7C3AED` (purple-600) | Gradient accent |
| Background | `#F9FAFB` (gray-50) | Page background |
| Surface | `#FFFFFF` | Card, modal backgrounds |
| Text Primary | `#111827` (gray-900) | Tiêu đề |
| Text Secondary | `#6B7280` (gray-500) | Body text |
| Border | `#D1D5DB` (gray-300) | Input borders |
| Error | `#EF4444` (red-500) | Error messages |

### Typography
| Role | Class | Size |
|------|-------|------|
| Heading 1 | `text-5xl` | 48px, font-extrabold |
| Heading 2 | `text-3xl` | 30px, font-bold |
| Heading 3 | `text-xl` | 20px, font-bold |
| Body | `text-base` | 16px, regular |
| Small | `text-sm` | 14px |
| Caption | `text-sm` | 14px, text-gray-500 |

### Spacing
- Sử dụng Tailwind spacing scale: `4px` (1) → `64px` (16)
- Card padding: `p-6` (24px) hoặc `p-8` (32px)
- Section gap: `space-y-6` (24px)

### Components hiện có
| Component | Vị trí | Mô tả |
|-----------|--------|-------|
| `Header` | `components/Header.js` | Logo + nav + user menu |
| `Footer` | `components/Footer.js` | Copyright |
| `LoginForm` | `components/LoginForm.js` | Form đăng nhập |
| `DefaultLayout` | `components/layout/DefaultLayout.js` | Header + Main + Footer |
| `Layout` | `components/layout/Layout.js` | Main + Footer |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm hoặc yarn
- PostgreSQL (BE đang chạy)

### Bước 1: Install dependencies
```bash
cd languagelearnfe
npm install
# hoặc: yarn install
```

### Bước 2: Environment variables
```bash
cp .env.example .env.local
```

File `.env.example` / `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

> **Lưu ý**: Next.js chỉ expose biến có prefix `NEXT_PUBLIC_` ra client. Production: ghi `languagelearnfe/.env.local` trên server rồi `yarn build`.

### Bước 3: Chạy dev server
```bash
npm run dev
# Server chạy tại http://localhost:3000
```

### Bước 4: Build production
```bash
npm run build
npm run start
```

---

## 🔑 Authentication Flow

1. User submit login form → dispatch `login(payload)` async thunk
2. `authSlice` gọi `/api/auth/login/` → nhận token
3. Lưu token vào **js-cookie** (`token`, expires 7 days)
4. Axios interceptor tự động thêm `Authorization: Token <token>` vào mọi request
5. Page chuyển sang `/home`
6. `Header` gọi `getMe()` để load thông tin user

### State Shape (Redux)
```js
{
  auth: {
    token: null | string,
    user: null | { id, username, ... },
    loading: boolean,
    error: string | null
  }
}
```

---

## 📌 TODO / Improvements

- [ ] Hoàn thiện các pages: Register, Dashboard, Vocabulary, Listening, Speaking, Review, Test
- [ ] Protected routes (redirect về login nếu chưa auth)
- [ ] Form validation (react-hook-form / zod)
- [ ] Error boundary + global error handling
- [ ] Toast / notification system
- [ ] Responsive design hoàn chỉnh (mobile, tablet, desktop)
- [ ] Dark mode
- [ ] Internationalization (i18n) - next-i18next
- [ ] SEO optimization (meta tags, Open Graph)
- [ ] Image optimization (next/image)
- [ ] Unit tests (Jest + React Testing Library)
- [ ] Component library (Storybook)
- [ ] CI/CD (Vercel)
- [ ] Loading states + skeleton screens
- [ ] Infinite scroll / pagination
