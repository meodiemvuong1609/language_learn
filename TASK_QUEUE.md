# TASK QUEUE — LanguageLearn

> Prioritized, autonomously-maintained task queue. Companion to [`PROJECT_STATUS.md`](./PROJECT_STATUS.md).
> Priorities: **P0** critical/broken · **P1** high (broken functionality, security, architecture) · **P2** medium (UX, perf, important features) · **P3** low (refactor, nice-to-have).
> Status: `TODO` · `IN PROGRESS` · `DONE` · `BLOCKED`.

This queue **supersedes** the older `docs/archive/IMPROVEMENTS.md` and `docs/archive/TASK_CHECKLIST.md`, which were stale (they listed already-completed work as pending).

---

## Done in Autonomous Loop #4

| ID | Pri | Area | Description | Status |
|---|---|---|---|---|
| BE-05b | P2 | Backend | Remove unused `SpeakingPractice` model + migration | `DONE` |
| MOB-07 | P1 | Mobile | Speaking: `expo-av` record/play + persist duration; listening audio play | `DONE` |
| FE-08 | P2 | Frontend | Consolidate EmptyState/ErrorState/Toast/StatCard; remove unused Header; flashcard `alert()` → Toast | `DONE` |
| DES-01 | P2 | All | Unify mobile brand to primary blue `#2563EB` | `DONE` |

---

## Done in Autonomous Loop #3

| ID | Pri | Area | Description | Status |
|---|---|---|---|---|
| BE-08 | P1 | Backend | Flashcard `card_count` used `flashcard_set` (wrong related_name) and clashed with queryset annotate → 500 on deck list/actions. | `DONE` |
| BE-06 | P2 | Backend | Add flashcard API tests (deck CRUD, add/remove cards, progress/review/stats). | `DONE` |
| BE-07 (partial) | P2 | Backend | Explicit fields on vocabulary list/item/user serializers (drop `__all__`); flashcard querysets `select_related`. | `DONE` |
| MOB-05 | P2 | Mobile | Login loads `/auth/me` into Redux; profile shows real user; token in `expo-secure-store`; API errors use `message`. | `DONE` |
| MOB-06 | P1 | Mobile | Vocabulary list unwraps paginated `{results}` so `items.filter` no longer crashes. | `DONE` |
| FE-07 | P2 | Frontend | Register redirects to `/dashboard`; dashboard does not spin forever without a token. | `DONE` |

---

## Done in Autonomous Loop #2

| ID | Pri | Area | Description | Status |
|---|---|---|---|---|
| FE-06 | P1 | Frontend | Persist auth token cookie inside `login` thunk so register auto-login is not bounced by `ProtectedRoute`. | `DONE` |
| FE-05 (partial) | P2 | Frontend | Add `/` → `/home` redirect; 404 "home" link no longer 404s. | `DONE` |
| BE-02 | P1 | Backend | Pin `djangorestframework==3.15.2` (Django 5.0 compatible). | `DONE` |
| BE-03 | P1 | Backend | Read `SECRET_KEY` or `DJANGO_SECRET_KEY`; refuse insecure fallback when `DEBUG=False`. | `DONE` |
| BE-04 | P1 | Backend | Docker: `CMD` on `0.0.0.0`, Postgres service, matching WORKDIR volume. | `DONE` |
| SEC-01 | P1 | Backend | Strip leftover VietQR/OTP secrets from `general/general.py`; keep `convert_response`. | `DONE` |
| MOB-01 | P1 | Mobile | Restore default Tailwind palette (gray/red) + custom tokens via `extend`; include `Components/`. | `DONE` |
| MOB-02 | P1 | Mobile | NativeWind v4: `metro.config.js` + `global.css`; pin `tailwindcss@3.4.17`. | `DONE` |
| MOB-04 | P2 | Mobile | Register missing navigation routes as placeholder screens (no crash). | `DONE` |

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

**Acceptance for the loop:** FE `next lint` clean (warnings only) + `next build` 23/23 pages; BE `manage.py check` clean + `CreatedUpdatedBySignalTest` (4 tests) pass. ✅

---

## Open — P1 (High)

_None currently._

## Open — P2 (Medium)

| ID | Area | Description | Acceptance Criteria | Status |
|---|---|---|---|---|
| MOB-03 | Mobile | Wire skill screens to APIs | Live data + loading/error/empty | `DONE` |
| BE-05 | Backend | Dead code cleanup (urls, firebase); lesson kept for seed only | Tests green | `DONE` |
| TEST-01 | Frontend | typecheck + smoke tests | `npm test` / `npm run typecheck` | `DONE` |
| TEST-02 | Mobile | Smoke tests | `npm test` | `DONE` |
| FE-05 | Frontend | Sentence in sidebar; list→detail links | Navigation works | `DONE` |
| CI-01 | DevOps | GitHub Actions | CI on PRs | `DONE` |

## Open — P3 (Low / Nice-to-have)

| ID | Area | Description | Status |
|---|---|---|---|
| P3-01 | Frontend | Replace `alert()` with Toast | `DONE` |
| AUTH-02 | All | Forgot/reset password pages (web + mobile forgot) | `DONE` |
| P3-02 | Frontend | Move React 19 RC → stable once released for the toolchain. | `TODO` |
| P3-03 | All | Dark mode (persist `UserPreference.dark_mode`). | `DONE` |
| P3-04 | All | i18n (vi default, en). | `TODO` |
| P3-05 | Backend | Real speaking AI scoring (Whisper/Google Speech). | `TODO` |
| P3-06 | Frontend | PWA support; custom audio player with waveform. | `TODO` |

**Stop condition:** further feature work is P3-only (dark mode, i18n, Whisper, PWA). Core 6-skill + SRS MVP is complete.

---

### How this queue is maintained

Each autonomous loop: pick the highest-impact unblocked task, implement, run the project's real lint/typecheck/build/test commands, fix failures, update the relevant docs + `PROJECT_STATUS.md`, then mark the task `DONE` here and select the next one.
