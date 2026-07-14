# 🎨 Design System - LanguageLearn

Design system chung cho cả **Mobile App** và **Web App** của LanguageLearn. Mục tiêu: đảm bảo trải nghiệm người dùng nhất quán trên tất cả các nền tảng.

---

## 1. Màu sắc (Color Palette)

### Primary Colors
| Token | Tailwind Class | Hex | RGB | Mô tả |
|-------|---------------|-----|-----|-------|
| `primary-50` | `blue-50` | `#EFF6FF` | 239, 246, 255 | Background nhạt |
| `primary-100` | `blue-100` | `#DBEAFE` | 219, 234, 254 | Light accent |
| `primary-500` | `blue-500` | `#3B82F6` | 59, 130, 246 | Primary medium |
| `primary-600` | `blue-600` | `#2563EB` | 37, 99, 235 | **Primary** - nút chính, links |
| `primary-700` | `blue-700` | `#1D4ED8` | 29, 78, 216 | Hover states |
| `primary-900` | `blue-900` | `#1E3A8A` | 30, 58, 138 | Dark variant |

### Secondary Colors
| Token | Tailwind Class | Hex | RGB | Mô tả |
|-------|---------------|-----|-----|-------|
| `secondary-400` | `purple-400` | `#A78BFA` | 167, 139, 250 | Accent light |
| `secondary-500` | `purple-500` | `#8B5CF6` | 139, 92, 246 | Accent medium |
| `secondary-600` | `purple-600` | `#7C3AED` | 124, 58, 237 | **Secondary** - gradient accent |
| `secondary-700` | `purple-700` | `#6D28D9` | 109, 40, 217 | Dark accent |

### Semantic Colors
| Token | Tailwind Class | Hex | Mô tả |
|-------|---------------|-----|-------|
| `success` | `green-500` | `#22C55E` | Thành công, hoàn thành |
| `warning` | `yellow-500` | `#EAB308` | Cảnh báo |
| `error` | `red-500` | `#EF4444` | Lỗi, xóa |
| `danger` | `red-600` | `#DC2626` | Logout, critical |
| `info` | `sky-400` | `#38BDF8` | Thông tin |

### Accent / Brand Color (Mobile)
| Token | Class | Hex | Mô tả |
|-------|-------|-----|-------|
| `brand-red-100` | custom | `#FEE2E2` | Light red background |
| `brand-red-500` | custom | `#EF4444` | **Brand primary (mobile)** |
| `brand-red-dark-5` | custom | `#DC2626` | Darker red (buttons, headers) |

> ⚠️ **Lưu ý**: Mobile app hiện dùng `red` (`#EF4444`) làm primary brand color, trong khi Web app dùng `blue` (`#2563EB`). Cần thống nhất.

### Neutrals
| Token | Tailwind Class | Hex | Mô tả |
|-------|---------------|-----|-------|
| `gray-50` | `gray-50` | `#F9FAFB` | Page background |
| `gray-100` | `gray-100` | `#F3F4F6` | Section background |
| `gray-200` | `gray-200` | `#E5E7EB` | Border light |
| `gray-300` | `gray-300` | `#D1D5DB` | Border |
| `gray-500` | `gray-500` | `#6B7280` | Text secondary |
| `gray-700` | `gray-700` | `#374151` | Text body |
| `gray-800` | `gray-800` | `#1F2937` | Text heading |
| `gray-900` | `gray-900` | `#111827` | Text primary |
| `white` | `white` | `#FFFFFF` | Surface, cards |

### Gradient Presets
| Name | From → To | Tailwind |
|------|-----------|----------|
| `gradient-primary` | blue-500 → purple-600 | `bg-gradient-to-r from-blue-500 to-purple-600` |
| `gradient-hero` | blue-50 → purple-100 | `bg-gradient-to-r from-blue-50 to-purple-100` |
| `gradient-brand-mobile` | brand-red | Red header bg |

---

## 2. Typography

### Font Family
```
Mobile:  System default (SF Pro on iOS, Roboto on Android)
Web:     Inter (recommended) or system-ui
```

### Type Scale

| Role | Size | Weight | Line Height | Tailwind Class | Usage |
|------|------|--------|-------------|---------------|-------|
| Display | 48px | extrabold | 1.1 | `text-5xl font-extrabold` | Hero title (web) |
| H1 | 30px | bold | 1.2 | `text-3xl font-bold` | Section title, card title |
| H2 | 24px | bold | 1.3 | `text-2xl font-bold` | Sub-section |
| H3 | 20px | semibold | 1.4 | `text-xl font-semibold` | Card title, list item |
| Body | 16px | regular | 1.6 | `text-base` | Paragraph text |
| Small | 14px | regular | 1.5 | `text-sm` | Secondary text, captions |
| Caption | 12px | regular | 1.4 | `text-xs` | Timestamps, meta info |
| Button | 16px | semibold | 1 | `text-base font-semibold` | Button text |

### Font Color Usage
| Role | Color | Class |
|------|-------|-------|
| Heading | gray-900 | `text-gray-900` |
| Body | gray-700 | `text-gray-700` |
| Secondary | gray-500 | `text-gray-500` |
| On primary bg | white | `text-white` |
| Link | primary-600 | `text-blue-600` |
| Error | red-500 | `text-red-500` |

---

## 3. Spacing

### spacing Scale (Tailwind)
```
1  =  4px      (tight)
2  =  8px      (xs)
3  = 12px      (sm)
4  = 16px      (md)
6  = 24px      (lg)
8  = 32px      (xl)
12 = 48px      (2xl)
16 = 64px      (3xl)
```

### Layout Spacing Rules
| Context | Value | Usage |
|---------|-------|-------|
| Screen padding (mobile) | `px-6` (24px) | Horizontal padding |
| Screen padding (web) | `px-8` (32px) | Horizontal padding |
| Section gap | `mt-6` (24px) hoặc `space-y-6` | Vertical spacing |
| Card internal gap | `p-6` (24px) hoặc `p-4` | Card padding |
| Icon + text gap | `ml-3` (12px) | Inline items |

---

## 4. Border Radius

| Token | Class | Value | Usage |
|-------|-------|-------|-------|
| `radius-sm` | `rounded` | 4px | Small badges, tags |
| `radius-md` | `rounded-md` | 6px | Input corners |
| `radius-lg` | `rounded-lg` | 8px | Buttons |
| `radius-xl` | `rounded-xl` | 12px | Cards, modals |
| `radius-2xl` | `rounded-2xl` | 16px | Large cards |
| `radius-full` | `rounded-full` | 9999px | Avatars, pills, circles |

---

## 5. Shadows

| Token | Class | Mô tả |
|-------|-------|-------|
| `shadow-sm` | `shadow-sm` | Subtil (cards) |
| `shadow-md` | `shadow-md` | Medium (dropdowns) |
| `shadow-lg` | `shadow-lg` | Strong (modals) |
| `shadow-inner` | `shadow-inner` | Inset (footer) |

---

## 6. Components

### Buttons

| Variant | Style | Usage | Example class |
|---------|-------|-------|---------------|
| Primary | Filled, primary color | Submit, confirm | `bg-blue-600 text-white rounded-lg px-4 py-3` |
| Secondary | Filled, secondary | Alternative action | `bg-purple-600 text-white ...` |
| Outline | Border only | Cancel, secondary | `border border-blue-600 text-blue-600` |
| Ghost | No bg, no border | Minimal | `text-blue-600 hover:bg-blue-50` |
| Danger | Red filled | Delete, logout | `bg-red-600 text-white ...` |

### Buttons - States
- **Default**: as above
- **Hover**: darken 1 shade (`hover:bg-blue-700`)
- **Disabled**: `opacity-50 cursor-not-allowed`
- **Loading**: show ActivityIndicator / spinner, disable button

### Inputs
```
Structure:
┌──────────────────────────────┐
│ Icon (optional)              │
│ [Label]                      │
│ ┌──────────────────────────┐ │
│ │ Placeholder / Value      │ │
│ └──────────────────────────┘ │
│ [Helper text / Error msg]    │
└──────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Height | `h-12` (48px) mobile / `h-10` (40px) web |
| Border | `border border-gray-300 rounded-lg` |
| Focus ring | `focus:ring-2 focus:ring-blue-500 focus:border-transparent` |
| Background | `bg-white` hoặc `bg-gray-50` |
| Padding | `px-4 py-3` |
| Label | `text-sm font-medium text-gray-700 mb-1.5` |
| Error | `text-sm text-red-500 mt-1` |

### Cards
```html
<div class="bg-white rounded-xl shadow-sm p-6">
  <!-- Card content -->
</div>
```

| Property | Value |
|----------|-------|
| Background | `bg-white` |
| Radius | `rounded-xl` (12px) |
| Shadow | `shadow-sm` (mobile), `shadow-md` (web) |
| Padding | `p-6` (24px) |

### Lists / Menu Items
```html
<div class="flex-row items-center py-3 border-b border-gray-100">
  <Icon />
  <Text>Label</Text>
  <ChevronRight className="ml-auto" />
</div>
```

---

## 7. Icons

### Icon Libraries
| Platform | Library | Examples |
|----------|---------|---------|
| Mobile | `@expo/vector-icons` | MaterialIcons, FontAwesome5 |
| Web | `lucide-react` (recommended) hoặc inline SVG | Feather-style icons |

### Icon Sizes
| Size | Value | Usage |
|------|-------|-------|
| Small | 20px | Inline with text |
| Medium | 24px | Buttons, list items |
| Large | 32px | Feature cards |
| XL | 48px | Logo, empty state |

### Icon Colors
- Default: `gray-600` / `text-gray-600`
- On primary bg: `white`
- Brand accent: `red-500` (mobile) / `blue-600` (web)
- Inside colored badge: white on colored bg

---

## 8. Layout Principles

### Mobile App
- **Safe Area**: always respect safe area insets (notch, home indicator)
- **ScrollView**: main content area should be scrollable
- **Card-based layout**: primary UI pattern
- **Bottom-heavy navigation**: via screen categories (not tab bar currently)
- **Max width**: N/A (full screen)

### Web App
- **Max content width**: `max-w-6xl` (1152px) hoặc `max-w-4xl` (896px)
- **Centered**: `mx-auto`
- **Container padding**: `px-6` hoặc `px-8`
- **Responsive grid**: `grid-cols-1 md:grid-cols-3`

---

## 9. Dark Mode (Chưa implement)

### Recommended Dark Palette (đề xuất)
| Token | Light | Dark |
|-------|-------|------|
| Background | `gray-50` | `gray-900` |
| Surface | `white` | `gray-800` |
| Text primary | `gray-900` | `gray-100` |
| Text secondary | `gray-500` | `gray-400` |
| Border | `gray-200` | `gray-700` |

Có thể dùng Tailwind `dark:` modifier khi đã config xong.

---

## 10. Animation Guidelines

### Duration
| Type | Duration | Usage |
|------|----------|-------|
| Micro | 150ms | Button press, toggle |
| Standard | 250ms | Screen transition, fade |
| Emphasized | 400ms | Modal enter/exit, hero animation |

### Easing
- Default: `ease-out` for enter, `ease-in` for exit
- Standard: `cubic-bezier(0.4, 0, 0.2, 1)` (Material Design standard)

### Transitions to use
- Screen changes: slide from right (iOS default)
- Modals: fade in + scale up from 0.95 → 1
- Sheets: slide up from bottom
- Toast: slide in from top, auto dismiss 3s

---

## 11. Empty & Error States

### Empty State
- Icon (large, centered, gray-300)
- Title: "Chưa có dữ liệu" / "No data"
- Subtitle: Hướng dẫn ngắn
- Optional: CTA button

### Error State
- Icon: warning triangle hoặc error circle
- Title: "Đã có lỗi xảy ra"
- Message: Mô tả ngắn gọn
- Retry button

### Loading State
- Skeleton screens (preferred)
- Hoặc spinner centered
- Full screen overlay cho initial load

---

## 12. Accessibility

- Contrast ratio ≥ 4.5:1 cho text
- Touch targets ≥ 48×48px (mobile)
- Active states for all interactive elements
- Labels cho screen readers
- Focus indicators for keyboard navigation (web)
