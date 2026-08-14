# TASK QUEUE — LanguageLearn

> Prioritized, autonomously-maintained task queue. Companion to [`PROJECT_STATUS.md`](./PROJECT_STATUS.md).
> Priorities: **P0** critical/broken · **P1** high (broken functionality, security, architecture) · **P2** medium (UX, perf, important features) · **P3** low (refactor, nice-to-have).
> Status: `TODO` · `IN PROGRESS` · `DONE` · `BLOCKED`.

This queue **supersedes** the older `docs/archive/IMPROVEMENTS.md` and `docs/archive/TASK_CHECKLIST.md`, which were stale (they listed already-completed work as pending).

---

## Done in Autonomous Loop #1

| ID | Pri | Area | Description | Status |
|---|---|---|---|---|
| FE-01 | P1 | Frontend | `_app.js` honor per-page `getLayout` so `ProtectedRoute` + layouts actually run (previously **no route was auth-guarded**). | `DONE` |
| FE-02 | P1 | Frontend | Rehydrate auth token from cookie into Redux on load (hard refresh no longer logs the user out). | `DONE` |
| FE-03 | P1 | Frontend | Make `ProtectedRoute` SSR-safe (was calling `router.replace()` in render, crashing prerender once activated). | `DONE` |
| FE-04 | P2 | Frontend | Fix `register` double `/api` path (`/api/auth/register/` → `/auth/register/`). | `DONE` |
| DOC-01 | P2 | Docs | Create `PROJECT_STATUS.md` + `TASK_QUEUE.md`; correct root `README.md`; archive stale planning docs. | `DONE` |
| BE-01 | P1 | Backend | Fix `common/signals.py` to read the real thread-local via `account.middleware.get_current_user()`; scope to `BaseModel`; register signals in `CommonConfig.ready()` (fixes circular import). Added 4 regression tests. | `DONE` |

**Acceptance for the loop:** FE `next lint` clean (warnings only) + `next build` 22/22 pages + `tsc --noEmit` clean; BE `manage.py check` clean + `CreatedUpdatedBySignalTest` (4 tests) pass. ✅

---

## Open — P1 (High)

| ID | Area | Description | Acceptance Criteria | Status |
|---|---|---|---|---|
| BE-02 | Backend | Resolve `django==5.0` / `djangorestframework==3.14.0` incompatibility (bump DRF to ≥ 3.15). NOTE: the local venv currently runs DRF 3.14 with Django 5.0 and `manage.py check` passes, but `requirements.txt` should still pin a compatible DRF for reproducible installs. | `pip install -r requirements.txt` + `manage.py check` + test suite pass on Django 5.0. | `TODO` |
| BE-03 | Backend | Fix `SECRET_KEY` env mismatch (`.env` uses `DJANGO_SECRET_KEY`, settings reads `SECRET_KEY`). | With DEBUG=False and an env-provided key, no insecure fallback key is used. | `TODO` |
| BE-04 | Backend/DevOps | Make Docker runnable: add `CMD` (gunicorn), add a `db` Postgres service to compose, bind `0.0.0.0`, align WORKDIR/volume. | `docker compose up` serves the API on the host and connects to Postgres. | `TODO` |
| MOB-01 | Mobile | Fix Tailwind/NativeWind color palette: screens use undefined `red-*` / `gray-50..900`. Define the used tokens or migrate screens to existing tokens. | App renders with intended brand colors; no undefined-class fallbacks. | `TODO` |
| MOB-02 | Mobile | Complete NativeWind v4 setup: add `metro.config.js` with `withNativeWind` and a global CSS `@tailwind` import. | `className` styles compile and apply on device/simulator. | `TODO` |
| SEC-01 | Backend | Remove hardcoded third-party credentials in `general/general.py` (leftover VietQR/OTP code) and delete unused code. Rotate any exposed keys. | No secrets in tracked source; unused module removed; tests pass. | `TODO` |

## Open — P2 (Medium)

| ID | Area | Description | Acceptance Criteria | Status |
|---|---|---|---|---|
| MOB-03 | Mobile | Wire `Sentence`/`Listening`/`Speaking`/`Review`/`Test` screens to their existing services/slices; replace mock data. | Each screen loads live data with loading/error/empty states. | `TODO` |
| MOB-04 | Mobile | Register the navigation routes screens link to (`*Detail`, `*Practice`, `ForgotPassword`, etc.) or remove the dead navigation calls. | No "route not found" runtime errors. | `TODO` |
| MOB-05 | Mobile | Populate Redux `user` on login/getMe; show real profile data; move token to `expo-secure-store`. | Profile shows the logged-in user; token no longer in plaintext AsyncStorage. | `TODO` |
| BE-05 | Backend | Remove dead code: `lesson` app (or wire it), `speaking.SpeakingPractice`, unused `vocabulary/urls.py` & `flashcard/urls.py`. | Removed/wired with tests still green. | `TODO` |
| BE-06 | Backend | Add `flashcard` test coverage. | Tests cover deck/card/progress + custom actions. | `TODO` |
| BE-07 | Backend | Audit serializers using `fields = '__all__'` (esp. `AccountSerializer` exposing sensitive fields); add `select_related`/`prefetch_related` to avoid N+1. | Explicit fields on sensitive serializers; key list endpoints avoid N+1. | `TODO` |
| TEST-01 | Frontend | Add a test framework (Vitest/Jest + RTL) and a `typecheck` script; a few smoke tests. | `npm test` and `npm run typecheck` run in CI. | `TODO` |
| TEST-02 | Mobile | Add Jest + `@testing-library/react-native`; smoke tests for services/slices. | `yarn test` runs. | `TODO` |
| FE-05 | Frontend | Consolidate duplicate components (`StatCard`/`EmptyState`/`ErrorState`/`Toast` `.js` vs `ui/*.tsx`); remove dead `Header.js`/unused `ui/*`; add a `/` route or redirect to `/home`. | One implementation per component; `/` resolves. | `TODO` |
| CI-01 | DevOps | Add CI (GitHub Actions): BE (Postgres service + tests), FE (lint+build), Mobile (lint). | CI runs on PRs. | `TODO` |

## Open — P3 (Low / Nice-to-have)

| ID | Area | Description | Status |
|---|---|---|---|
| P3-01 | Frontend | Replace `alert()` with the existing Toast system across pages. | `TODO` |
| P3-02 | Frontend | Move React 19 RC → stable once released for the toolchain. | `TODO` |
| P3-03 | All | Dark mode (persist `UserPreference.dark_mode`). | `TODO` |
| P3-04 | All | i18n (vi default, en). | `TODO` |
| P3-05 | Backend | Real speaking AI scoring (Whisper/Google Speech). | `TODO` |
| P3-06 | Frontend | PWA support; custom audio player with waveform. | `TODO` |

---

### How this queue is maintained

Each autonomous loop: pick the highest-impact unblocked task, implement, run the project's real lint/typecheck/build/test commands, fix failures, update the relevant docs + `PROJECT_STATUS.md`, then mark the task `DONE` here and select the next one.
