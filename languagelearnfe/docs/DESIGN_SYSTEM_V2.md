# LanguageLearn Design System v2

## 1. Design Tokens

### Colors
| Role | Token | Value |
|------|-------|-------|
| Primary | primary-50..900 | #EFF6FF → #1E3A8A (blue scale) |
| Primary Base | primary-500 | #3B82F6 |
| Primary Action | primary-600 | #2563EB |
| Secondary | secondary-300..700 | #C4B5FD → #6D28D9 (purple scale) |
| Success | success-50, 100, 500, 600 | #ecfdf5, #d1fae5, #10b981, #059669 |
| Error | error-50..600 | #FEE2E2 → #DC2626 (red scale) |
| Warning | accent-50..600 | #fffbeb → #d97706 (amber scale) |
| Neutral | gray-50..900 | #f8fafc → #0f172a |
| Surfaces | surface-primary/secondary/tertiary | #ffffff / #f8fafc / #f1f5f9 |

### Typography
| Role | Value |
|------|-------|
| Font Family | 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif |
| Base Size | 1rem (16px) |
| Weights | 400 (normal), 500 (medium), 600 (semibold), 700 (bold) |
| Line Heights | 1.25 (tight), 1.5 (normal), 1.625 (relaxed) |

### Spacing Scale
0(0px) · 1(4px) · 2(8px) · 3(12px) · 4(16px) · 5(20px) · 6(24px) · 8(32px) · 10(40px) · 12(48px) · 16(64px) · 20(80px) · 24(96px)

### Border Radius
sm(6px) · md(10px) · lg(16px) · xl(24px) · full(9999px)

### Shadows
sm / md / lg / xl / 2xl — layered, subtle, educational aesthetic

### Animations
- `fadeIn` / `fadeInUp` — page and card entrance
- `slideInRight` — mobile nav drawer
- `scaleIn` — modal and dropdown
- `shimmer` — skeleton loading (used in Skeleton component)
- `spin` — loading spinners
- Transitions: `fast(150ms)`, `base(250ms)`, `slow(350ms)` — cubic-bezier(0.4,0,0.2,1)

---

## 2. Component Catalog

### Button
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | primary \| secondary \| success \| danger \| ghost | primary | Visual style |
| size | sm \| md \| lg | md | Physical size |
| isLoading | boolean | false | Loading spinner state |
| fullWidth | boolean | false | Stretch to parent width |
| leftIcon / rightIcon | ReactNode | — | Icon slots |

Sizes: sm(36px h, 13px) · md(44px h, 14px) · lg(48px h, 16px). Radius: 10px.

### Input
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | — | Field label |
| error | string | — | Error message (red border + helper text) |
| hint | string | — | Helper text below input |
| leftIcon / rightIcon | ReactNode | — | Icon slots |
| size | sm \| md \| lg | md | Physical size |

Accessibility: `aria-invalid`, `aria-describedby` links error/hint text.

### Card
| Prop | Type | Default |
|------|------|---------|
| title / subtitle | string | — |
| footer | ReactNode | — |
| hoverable | boolean | false |
| padding | none \| sm \| md \| lg | md |

Structure: optional header → body → optional footer. Shadow + border on all sizes.

### Badge
| Prop | Type | Default |
|------|------|---------|
| variant | primary \| success \| warning \| error \| gray | primary |
| size | sm \| md \| lg | md |
| dot | boolean | false |

Fully rounded pill. Color matches design tokens.

### Avatar
| Prop | Type | Default |
|------|------|---------|
| src | string | — |
| name | string | — |
| size | xs \| sm \| md \| lg \| xl | md |

Falls back to initials with deterministic color palette when no `src`.

### Modal
| Prop | Type | Default |
|------|------|---------|
| open | boolean | — |
| onClose | () => void | — |
| title | string | — |
| size | sm \| md \| lg \| xl | md |

Closes on Escape + backdrop click. Locks body scroll when open.

### Dropdown
| Prop | Type | Default |
|------|------|---------|
| trigger | ReactNode | — |
| items | DropdownItem[] | — |

Closes on outside click. Supports danger items and disabled state.

### Tabs
| Prop | Type | Default |
|------|------|---------|
| items | {key, label, icon?, disabled?}[] | — |
| activeKey | string | — |
| onChange | (key) => void | — |

ARIA: `role="tablist"`, `role="tab"`, `aria-selected`.

### ProgressBar
| Prop | Type | Default |
|------|------|---------|
| value | number | 0 |
| max | number | 100 |
| size | sm \| md \| lg | md |
| variant | primary \| success \| warning \| danger | primary |
| showLabel | boolean | false |

ARIA: `role="progressbar"`.

### Skeleton
| Prop | Type | Default |
|------|------|---------|
| variant | text \| rectangular \| circular | text |
| width / height | string \| number | 100% / 20px |

Shimmer animation.

### Toast
Context-based. `useToast()` hook. Types: success / error / warning / info. Auto-dismiss at 4s.

### EmptyState / LoadingState / ErrorState
Predictable layout — icon → title → message → optional action.

---

## 3. Layout System

### AppShell
Assembles the complete authenticated layout:
- Desktop: fixed Sidebar (260px) + scrollable main (ml-[260px]) + optional BottomNav
- Mobile: fixed top bar (hamburger + page title) + slide-out Sidebar + BottomNav + main
- Public pages bypass the shell (login/register/404)
- `key={router.asPath}` triggers entry animation on route change

### Sidebar
8 navigation items (Dashboard, Vocabulary, Listening, Speaking, Flashcard, Quiz, Reading, Profile). Active state: primary-50 bg + primary-700 text. Footer with user avatar (Avatar component) + logout.

### BottomNav
Mobile-only. `display: none` on md+. 6 items in a space-around row.
