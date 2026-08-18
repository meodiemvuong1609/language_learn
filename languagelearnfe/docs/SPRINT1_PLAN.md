# Sprint 1 - Technical Plan

## Sprint Goals
1. Establish a production-grade design system with typed, accessible components.
2. Implement a modern application shell with responsive layout.
3. Document decisions and verify build health.

## Phase 1 - Design System Foundation
| Task | Est. | Status |
|------|------|--------|
| TypeScript strict config (tsconfig.json) | 2h | ✅ |
| Utility: cn() (clsx + tailwind-merge) | 30m | ✅ |
| Design tokens: colors, typography, spacing, shadows, radius, animation | 2h | ✅ |
| Component types (ButtonProps, InputProps, etc.) | 1h | ✅ |
| Button component | 1h | ✅ |
| Input component | 1.5h | ✅ |
| Badge component | 1h | ✅ |
| Avatar component | 1h | ✅ |
| Card component | 1.5h | ✅ |
| Modal component | 2h | ✅ |
| Dropdown component | 1.5h | ✅ |
| Tabs component | 1h | ✅ |
| ProgressBar component | 1h | ✅ |
| Skeleton component | 30m | ✅ |
| Toast (Provider + hook) | 1h | ✅ |
| EmptyState component | 30m | ✅ |
| LoadingState component | 30m | ✅ |
| ErrorState component | 30m | ✅ |
| Write docs/DESIGN_SYSTEM_V2.md | 2h | ✅ |

## Phase 2 - Application Shell
| Task | Est. | Status |
|------|------|--------|
| Sidebar component | 2h | ✅ |
| BottomNav component | 1.5h | ✅ |
| AppShell layout (desktop + mobile) | 3h | ✅ |
| Update DefaultLayout.js to use AppShell | 30m | ✅ |
| Page transitions (animate-fade-in) | 30m | ✅ |
| Active route highlighting | 30m | ✅ |
| Mobile responsive breakpoints | 1h | ✅ |

## Phase 3 - Verification
| Task | Est. | Status |
|------|------|--------|
| npm run build | 2h | 🔲 |
| npm run lint | 1h | 🔲 |
| Fix TypeScript errors | 2h | 🔲 |

## Files Affected
- `src/types/tokens.ts` — design tokens
- `src/types/components.ts` — component prop interfaces
- `src/lib/cn.ts` — className merge utility
- `src/components/ui/*.tsx` — 14 design system components
- `src/components/layout/AppShell.tsx` — root layout
- `src/components/layout/Sidebar.tsx` — desktop sidebar nav
- `src/components/layout/BottomNav.tsx` — mobile bottom nav
- `src/components/layout/DefaultLayout.js` — updated to use AppShell
- `docs/DESIGN_SYSTEM_V2.md` — component documentation
- `docs/SPRINT1_PLAN.md` — this file

## Current Status: 85% Complete
Remaining: build verification + lint fix.
