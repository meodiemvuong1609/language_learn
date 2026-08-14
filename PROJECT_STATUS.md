# PROJECT STATUS — LanguageLearn

> **Single source of truth** for the current state of the LanguageLearn monorepo.
> Last updated: 2026-08-15 (Autonomous Loop #1).
> This file reflects the **actual code**, verified against the repositories — not aspirational docs.
> For the prioritized work list see [`TASK_QUEUE.md`](./TASK_QUEUE.md).

Legend: `DONE` · `IN PROGRESS` · `PARTIAL` · `TODO` · `BLOCKED` · `TECH DEBT` · `BUG`

---

## 1. Where is the project now?

LanguageLearn is a 3-part English-learning platform managed as a monorepo of **git submodules**:

| Submodule | Stack (actual) | Maturity |
|---|---|---|
| `languagelearnbe` | Django 5.0 + DRF 3.14, **DRF Token auth**, **PostgreSQL only** | Functional API, ~105 tests. `PARTIAL` |
| `languagelearnfe` | **Next.js 15 (Pages Router)**, React 19 RC, Redux Toolkit, Axios, Tailwind v3 | 22 routes, feature-rich. `IN PROGRESS` |
| `languagelearn` (mobile) | Expo SDK 53, RN 0.79, React 19, Redux Toolkit, Axios, NativeWind v4 | **Skeleton** — only Auth + Vocabulary wired. `PARTIAL` |

> ⚠️ The root `README.md` previously described the frontend as "App Router" and implied the mobile app uses React Query — **both are false**. The frontend is Pages Router; the mobile app uses Redux Toolkit + `createAsyncThunk` (no React Query). Corrected in this loop.

---

## 2. Backend — `languagelearnbe` (Django REST)

**Status: `PARTIAL` (functional API, several correctness/security items open).**

- `DONE` DRF Token authentication (`rest_framework.authtoken`), login/register/me/forgot-password/reset-password.
- `DONE` Apps wired into routes: `account`, `common`, `vocabulary`, `listening`, `speaking`, `sentence`, `reading`, `question`, `flashcard`.
- `DONE` ~105 test methods across 8 apps (`account`, `common`, `vocabulary`, `listening`, `speaking`, `reading`, `question`, `sentence`).
- `PARTIAL` Pagination via `common.mixins.StandardResultsSetPagination` (PAGE_SIZE 20).
- `TECH DEBT` `lesson` app is dead — a model + migration exist but **no serializer/view/url** (unreachable).
- `TECH DEBT` `speaking.SpeakingPractice` model has no serializer/view/route.
- `TECH DEBT` `vocabulary/urls.py` and `flashcard/urls.py` define routers that are **never `include()`d** (routing is centralized in `be/urls.py`).
- `TECH DEBT` `general/general.py` is leftover from an unrelated "MyKiot" project (VietQR/OTP helpers) with **hardcoded third-party credentials in tracked source**. Only `convert_response` is used.
- `FIXED (loop #1)` `common/signals.py` recreated a fresh `threading.local()`, so `created_by`/`updated_by` were **never populated**. Now reads `account.middleware.get_current_user()`, is scoped to `BaseModel` instances, and is registered in `CommonConfig.ready()` (avoids a circular import). Covered by 4 new `SimpleTestCase` regression tests.
- `BUG`/`TECH DEBT` Version mismatch: `djangorestframework==3.14.0` is not officially compatible with `django==5.0` (needs DRF ≥ 3.15).
- `TECH DEBT` `SECRET_KEY` mismatch: `.env` sets `DJANGO_SECRET_KEY` but settings reads `SECRET_KEY` → silently falls back to the insecure dev key.
- `BUG` Docker is not runnable as written: `Dockerfile` `CMD` commented out; `Docker-compose.yml` runs `runserver` bound to `127.0.0.1` (not `0.0.0.0`), no `db`/Postgres service, WORKDIR mismatch (`/usr/src/app` vs mounted `/code`).
- `TODO` No test coverage for `flashcard` despite rich custom logic.
- Security note: `.env` is **git-ignored** (not committed) — good. `.env.example` is committed. Rotate any real keys that have ever been shared.

## 3. Frontend Web — `languagelearnfe` (Next.js 15, Pages Router)

**Status: `IN PROGRESS` (builds clean; several bugs fixed this loop).**

- `DONE` 22 routes under `src/pages/` (auth, dashboard, vocabulary + SRS review, listening, speaking, sentence, reading, quizzes, flashcard, profile, 404).
- `DONE` Redux Toolkit store with `authSlice` (only slice); Axios instance with token + 401/403/500 interceptors; token stored in a `js-cookie` cookie.
- `DONE` Design tokens live in `src/styles/globals.css` (CSS vars) + a mostly-unused typed `ui/` component library.
- `FIXED (loop #1)` `_app.js` only honored `Component.layout`, but 19 pages define `getLayout` → their layouts **and `ProtectedRoute`** never ran ⇒ **no route was auth-guarded**. `_app.js` now supports both patterns.
- `FIXED (loop #1)` Auth token was never rehydrated from the cookie into Redux on reload ⇒ hard refresh logged users out. Added `setToken` reducer + rehydration in `_app`/`ProtectedRoute`.
- `FIXED (loop #1)` `ProtectedRoute` called `router.replace()` during render (crashed SSR/prerender once activated). Rewritten to be effect-based and SSR-safe.
- `FIXED (loop #1)` `register` posted to `/api/auth/register/` → double `/api` with the `/api` base URL. Now `/auth/register/`.
- `TECH DEBT` `/` (root) has no page → 404; landing is `/home`. Duplicate implementations of `StatCard`, `EmptyState`, `ErrorState`, `Toast` (`.js` vs `ui/*.tsx`). `Header.js` and most `ui/*` components are unused.
- `TODO` No test framework configured (`test`/`typecheck` scripts absent). Lint passes with warnings only.

## 4. Mobile — `languagelearn` (Expo / React Native)

**Status: `PARTIAL` — a functional skeleton.**

- `DONE` Auth (Login/Register/Profile) + `VocabularyScreen` wired end-to-end to backend via Redux + Axios.
- `PARTIAL`/`TODO` `Home`, `Sentence`, `Listening`, `Speaking`, `Review`, `Test` screens render **hardcoded mock data**; their services/slices exist but are **never used**.
- `BUG` Color palette mismatch: screens use `red-*` and numeric `gray-50/100/...` classes that the Tailwind theme (blue-only, custom gray keys) **does not define** → brand colors don't render as intended.
- `BUG` NativeWind v4 setup incomplete: no `metro.config.js` (`withNativeWind`) and no global CSS `@tailwind` import.
- `BUG` Screens navigate to unregistered routes (`ForgotPassword`, `VocabularyDetail`, `*Detail`/`*Practice`, etc.) → runtime errors/no-ops.
- `TECH DEBT` `react-native-toast-message` unused; `userSlice` never dispatched; `Components/EmptyState.js` & `ListItem.js` dead; token stored in plaintext `AsyncStorage` (no `expo-secure-store`).
- `BLOCKED` `.env` is absent (git-ignored); `SERVER_URL` is `undefined` until a `.env` is created ⇒ API calls fail.
- `TODO` No tests/lint/typecheck configured.

---

## 5. Cross-cutting / DevOps

- `TODO` No CI/CD pipelines anywhere.
- `TODO` No frontend/mobile test frameworks.
- `TECH DEBT` Documentation drift (being addressed): several `.md` files described features/architecture that don't match the code.

---

## 6. Immediate priorities (next)

See [`TASK_QUEUE.md`](./TASK_QUEUE.md) for the full, ID'd list. Top of queue:

1. **P1** Align DRF/Django versions in `requirements.txt` (DRF ≥ 3.15) & fix `SECRET_KEY` env name.
2. **P1** Make Docker runnable (add `CMD`, `db` service, bind `0.0.0.0`).
3. **P1** Mobile: fix Tailwind color palette + NativeWind metro/global CSS setup.
4. **P2** Mobile: wire the mock screens to their existing services/slices; register missing routes.
5. **P2** Remove backend dead code (`lesson`, `general/general.py` hardcoded creds, unused `urls.py`).
6. **P2** Add test frameworks to FE/mobile; add flashcard tests to BE.
