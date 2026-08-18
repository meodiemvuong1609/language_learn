# PROJECT STATUS — LanguageLearn

> **Single source of truth** for the current state of the LanguageLearn monorepo.
> Last updated: 2026-08-18 (MVP 6 skills + SRS; speaking record + brand unify).
> This file reflects the **actual code**, verified against the repositories — not aspirational docs.
> For the prioritized work list see [`TASK_QUEUE.md`](./TASK_QUEUE.md).

Legend: `DONE` · `IN PROGRESS` · `PARTIAL` · `TODO` · `BLOCKED` · `TECH DEBT` · `BUG`

---

## 1. Where is the project now?

LanguageLearn is a 3-part English-learning platform managed as a monorepo of **git submodules**:

| Submodule | Stack (actual) | Maturity |
|---|---|---|
| `languagelearnbe` | Django 5.0 + DRF 3.15.2, **DRF Token auth**, **PostgreSQL only** | Functional API, ~105 tests. `PARTIAL` |
| `languagelearnfe` | **Next.js 15 (Pages Router)**, React 19 RC, Redux Toolkit, Axios, Tailwind v3 | 22 routes, feature-rich. `IN PROGRESS` |
| `languagelearn` (mobile) | Expo SDK 53, RN 0.79, React 19, Redux Toolkit, Axios, NativeWind v4 | Auth + 6 skills wired (lists/details). `IN PROGRESS` |

> ⚠️ The root `README.md` previously described the frontend as "App Router" and implied the mobile app uses React Query — **both are false**. The frontend is Pages Router; the mobile app uses Redux Toolkit + `createAsyncThunk` (no React Query). Corrected in this loop.

---

## 2. Backend — `languagelearnbe` (Django REST)

**Status: `PARTIAL` (functional API, several correctness/security items open).**

- `DONE` DRF Token authentication (`rest_framework.authtoken`), login/register/me/forgot-password/reset-password.
- `DONE` Apps wired into routes: `account`, `common`, `vocabulary`, `listening`, `speaking`, `sentence`, `reading`, `question`, `flashcard`.
- `DONE` ~105 test methods across 8 apps (`account`, `common`, `vocabulary`, `listening`, `speaking`, `reading`, `question`, `sentence`).
- `PARTIAL` Pagination via `common.mixins.StandardResultsSetPagination` (PAGE_SIZE 20).
- `TECH DEBT` `lesson` app is dead — model + seed only, no public API.
- `DONE` Removed unused `speaking.SpeakingPractice` model.
- `FIXED (loop #2)` `general/general.py` leftover VietQR/OTP helpers with **hardcoded credentials** removed; only `convert_response` remains.
- `FIXED (loop #1)` `common/signals.py` recreated a fresh `threading.local()`, so `created_by`/`updated_by` were **never populated**. Now reads `account.middleware.get_current_user()`, is scoped to `BaseModel` instances, and is registered in `CommonConfig.ready()` (avoids a circular import). Covered by 4 new `SimpleTestCase` regression tests.
- `FIXED (loop #2)` DRF pinned to `3.15.2` (compatible with Django 5.0).
- `FIXED (loop #2)` `SECRET_KEY` reads `SECRET_KEY` or `DJANGO_SECRET_KEY`; insecure fallback is refused when `DEBUG=False`.
- `FIXED (loop #2)` Docker: `CMD` binds `0.0.0.0:8000`, compose adds Postgres, volume matches WORKDIR.
- `DONE` Logout (`POST /api/auth/logout/`) revokes token; forgot-password no longer returns uid/token; `PATCH /api/auth/me/`.
- `DONE` Server-grade submit: listening `submit_answer`, reading `submit_comprehension`, quiz `submit` (retakes allowed), sentence `submit_exercise`, speaking `submit_self_score`, vocab `review_word`.
- `DONE` `django-filter` enabled; sentence prefetch fixed; unused `vocabulary/urls.py` & `flashcard/urls.py` removed.
- `TODO` Dead `lesson` app remains installed for seed/migrations (no public API).
- `DONE` UserPreference `dark_mode` + `GET/PATCH /api/preferences/me/`; web ThemeProvider; profile daily goal.

## 3. Frontend Web — `languagelearnfe` (Next.js 15, Pages Router)

**Status: `IN PROGRESS` (builds clean; several bugs fixed this loop).**

- `DONE` 22 routes under `src/pages/` (auth, dashboard, vocabulary + SRS review, listening, speaking, sentence, reading, quizzes, flashcard, profile, 404).
- `DONE` Redux Toolkit store with `authSlice` (only slice); Axios instance with token + 401/403/500 interceptors; token stored in a `js-cookie` cookie.
- `DONE` Design tokens live in `src/styles/globals.css` (CSS vars); `EmptyState`/`ErrorState`/`Toast`/`StatCard` share one implementation.
- `FIXED (loop #1)` `_app.js` only honored `Component.layout`, but 19 pages define `getLayout` → their layouts **and `ProtectedRoute`** never ran ⇒ **no route was auth-guarded**. `_app.js` now supports both patterns.
- `FIXED (loop #1)` Auth token was never rehydrated from the cookie into Redux on reload ⇒ hard refresh logged users out. Added `setToken` reducer + rehydration in `_app`/`ProtectedRoute`.
- `FIXED (loop #1)` `ProtectedRoute` called `router.replace()` during render (crashed SSR/prerender once activated). Rewritten to be effect-based and SSR-safe.
- `FIXED (loop #1)` `register` posted to `/api/auth/register/` → double `/api` with the `/api` base URL. Now `/auth/register/`.
- `FIXED (loop #2)` Register auto-login did not write the auth cookie → `ProtectedRoute` sent users back to login. Cookie is now set in the `login` thunk.
- `FIXED (loop #2)` `/` had no page (404); now redirects to `/home`.
- `DONE` 22 routes; list pages link to details; sentence/quiz/listening/reading/speaking/profile use Axios + server grade.
- `DONE` Vocab review persists SRS via `review_word`.
- `DONE` Shared `EmptyState` / `ErrorState` / `Toast` / `StatCard`; unused `Header.js` removed.
- `DONE` Smoke test + `typecheck` scripts.

## 4. Mobile — `languagelearn` (Expo / React Native)

**Status: `PARTIAL` — a functional skeleton.**

- `DONE` Auth (Login/Register/Profile) + `VocabularyScreen` wired end-to-end to backend via Redux + Axios.
- `DONE` Auth-gated navigator; live lists for Sentence/Listening/Speaking/Review/Test/Reading/Flashcard + detail screens; forgot-password screen.
- `DONE` Speaking self-score + `expo-av` recording (duration persisted; no Whisper).
- `DONE` Brand primary unified to web blue (`#2563EB`); red reserved for error/danger.
- `DONE` Token in `expo-secure-store`; Home uses `dashboard-stats`.
- `TECH DEBT` Some unused slices/components remain (`listeningSlice` unused by new screens which call `learningService` directly).

---

## 5. Cross-cutting / DevOps

- `DONE` GitHub Actions CI (BE tests + FE lint/typecheck/test/build + mobile test).
- `DONE` FE/mobile smoke tests (`npm test`); full RTL/RNTL still P3.
- `TECH DEBT` Documentation drift (being addressed): several `.md` files described features/architecture that don't match the code.

---

## 6. Immediate priorities (next)

MVP learning loops are in place. Remaining work is **P3** (diminishing returns vs product completeness):

1. Dark mode / i18n
2. Real speaking AI scoring
3. PWA / waveform player
4. React 19 stable upgrade

Do **not** start curriculum `Lesson` unless product direction changes.
