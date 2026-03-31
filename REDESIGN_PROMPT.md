# 🎨 Expo Flow Manage Exhibitor — Redesign Prompt

### Modern Next.js Web App · 2025–2026 Design Trends

---

## 📌 Context & Background

You are redesigning **Expo Flow Manage Exhibitor**, a B2B self-service portal for trade exhibition management (ILDEX Vietnam 2026 / Horti & Agri Vietnam 2026). The app allows exhibitors to:

- Manage their company profile
- Register and manage staff members (with quota system)
- Generate and print badge with QR code

**Current Tech Stack (keep as-is):**

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4 + shadcn/ui (New York style) + Radix UI
- Zustand, React Hook Form, Zod, Axios
- Lucide React icons, next-themes (dark/light)

**Current brand**: Deep Teal / Emerald Green `hsl(180 25% 25%)` as primary, Inter font, glassmorphism on navbar & login.

---

## 🎯 Redesign Objective

Redesign the full visual identity and UI of the application to feel **premium, modern, and memorable** — the kind of interface that wins design awards and gets shared on Dribbble/Awwwards in 2025–2026. Keep all functionality intact; elevate the aesthetics and UX.

---

## 🌊 Design Direction: "Precision Luxury B2B"

**Concept**: Think Bloomberg Terminal meets Linear.app meets Stripe Dashboard — ultra-refined data-dense interfaces that feel _expensive_ and _confident_. Not playful, not corporate-boring. Serious but beautiful.

**Mood**: Dark-first design with selective luminous accents. Crisp typographic hierarchy. Data that breathes.

---

## 🎨 2025–2026 Design Trends to Apply

### 1. **Dark-First with Selective Light Mode**

Make dark mode the _primary, hero_ experience. Use a near-black base `oklch(0.10 0.02 220)` — not pure black, but a cold dark slate with a subtle blue undertone. Light mode should feel equally polished, not just "white background".

### 2. **Bento Grid Layouts**

Replace traditional card-stacking with asymmetric bento grid layouts on the dashboard. Each stat or info block occupies a purposeful cell. Some cells span 2 columns, some are tall, creating visual rhythm. Reference: Apple WWDC 2023, Vercel dashboard, Linear.

```
┌─────────────────┬──────────┬──────────┐
│                 │          │          │
│  Company Info   │ Username │  Booth   │
│  (large cell)   │          │          │
│                 ├──────────┴──────────┤
│                 │   Staff Quota Bar   │
├────────┬────────┼─────────────────────┤
│ Staff  │ Status │    Quick Actions    │
│ Count  │ Badge  │                     │
└────────┴────────┴─────────────────────┘
```

### 3. **Fluid Typography with Variable Fonts**

Use **Geist** (Vercel's font, available on Google Fonts) or **DM Sans** as the primary UI font — clean, modern, slightly geometric. Pair with **Geist Mono** or **JetBrains Mono** for code/ID values, booth numbers, badge IDs.

Replace Inter entirely. Use `@next/font` or `next/font/google` for self-hosted loading.

```tsx
import { DM_Sans, DM_Mono } from 'next/font/google'
// or
import localFont from 'next/font/local'
// Use Geist (download from vercel.com/font)
```


```

### 5. **Glowing Accent System**

Replace plain colored badges/icons with _glow effects_ on interactive/important elements:

```css
/* Emerald glow for primary actions */
.glow-emerald {
  box-shadow:
    0 0 0 1px oklch(0.75 0.2 160 / 0.3),
    0 0 20px oklch(0.75 0.2 160 / 0.15),
    0 0 40px oklch(0.75 0.2 160 / 0.05);
}
```

### 6. **Fluid Animated Borders (Aurora Border)**

Use CSS `@property` animated gradient borders on key cards:

```css
@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.aurora-border {
  background: conic-gradient(
    from var(--angle),
    transparent 70%,
    oklch(0.75 0.2 160) 80%,
    transparent 90%
  );
  animation: border-rotate 4s linear infinite;
  border-radius: inherit;
}

@keyframes border-rotate {
  to {
    --angle: 360deg;
  }
}
```

### 7. **Micro-interaction Animations**

Every interactive element should have intentional motion using Tailwind + CSS transitions:

- **Sidebar nav items**: Slide in from left with staggered delay on mount
- **Stats cards**: Count-up numbers animation on first load
- **Buttons**: Subtle scale(0.97) on press + shimmer hover effect
- **Form inputs**: Border animates to emerald on focus with a glow pulse
- **Table rows**: Fade + slide-up on initial render (staggered)
- **Quota bar**: Animated fill progress on mount

### 8. **Spatial Layout with Generous Breathing Room**

- Main content max-width: `1280px` with auto margins
- Sidebar: `280px` fixed, collapsible to `64px` icon-only rail
- Cards: `24px` internal padding, `16px` gaps in bento grid
- Section separators: Use subtle gradient dividers, not hard borders

### 9. **Status Indicators with Semantic Color Tokens**

Create a semantic color system beyond just primary/secondary:

```css
:root {
  --status-active: oklch(0.75 0.18 145); /* Emerald */
  --status-pending: oklch(0.78 0.15 55); /* Amber */
  --status-inactive: oklch(0.55 0.01 220); /* Cool gray */
  --status-error: oklch(0.65 0.22 25); /* Red */
  --status-locked: oklch(0.6 0.05 260); /* Purple-gray (cutoff date) */
}
```

### 10. **Collapsible Sidebar Rail**

Modernize the sidebar into a responsive rail:

- Desktop: `280px` expanded, shows icon + label
- Tablet: `64px` icon-only rail (tooltip on hover)
- Mobile: Slide-out drawer
- Smooth `width` transition with `cubic-bezier(0.4, 0, 0.2, 1)`

---

## 🖥️ Page-by-Page Redesign Specs

### A. Login Page (`/login`)

**Current**: Basic card with glassmorphism

**Redesign**:

- Full viewport split layout: Left side = animated brand panel (60%), Right side = login form (40%)
- Left panel: Dark gradient with floating geometry — subtle animated orbs or mesh gradient background, event logo, event name in large editorial typography
- Right panel: Pure dark card, elevated with `backdrop-blur-2xl`, the form feels like a "vault" opening
- Input fields: `h-12`, rounded-xl, dark glass background `oklch(1 0 0 / 0.05)`, emerald focus ring with subtle outer glow
- CTA button: Full-width, gradient `emerald-500 → teal-500`, with a shimmer sweep animation on hover
- Below form: Minimal "Secured by Expo Flow" badge with lock icon

```tsx
// Login layout structure
<div className="grid min-h-screen lg:grid-cols-[60%_40%]">
  <BrandPanel /> {/* Animated left panel */}
  <FormPanel /> {/* Login form right panel */}
</div>
```

### B. Dashboard / Exhibitor Page (`/exhibitor`)

**Current**: Stacked cards layout

**Redesign into 3 sections**:

**Section 1 — Hero Header**

```
┌─────────────────────────────────────────────────────┐
│  [Avatar/Company Initials]  Company Name            │
│  ILDEX Vietnam 2026 · Booth A-101                   │
│                                    [Edit] [Print]   │
└─────────────────────────────────────────────────────┘
```

- Large company name `text-3xl font-semibold tracking-tight`
- Event name as a glowing pill badge
- Gradient accent bar below header

**Section 2 — Bento Stats Grid**

```
┌──────────────────┬────────────┬────────────────────┐
│  🏢 Company Info │ 👤 Username│  🎫 Staff Quota    │
│  (spans 2 rows)  │  EB-001    │  ████░░░  8/12     │
│                  ├────────────┤                    │
│                  │ 📍 Booth   │                    │
│                  │  A-101     │                    │
└──────────────────┴────────────┴────────────────────┘
```

**Section 3 — Staff Management Panel**

- Full-width card with inner tab navigation (All / Active / Inactive)
- Table redesign: Remove heavy borders, use row hover highlight instead
- Each row: avatar-initial circle + name + email + status badge + actions
- "Add Staff" button: Floating action position, top-right of table header
- Quota indicator: Thin progress bar at very top of staff panel card

### C. Staff Table Redesign

Replace the current table with a **data-dense but airy** design:

```
 ┌──────────────────────────────────────────────────────────────────────┐
 │  Staff Members                                    [ + Add Member ]  │
 │  ─────────────────────────────────────────────────────────────────  │
 │  ████████░░░░  8 of 12 quota used                                   │
 ├──────────────────────────────────────────────────────────────────────┤
 │  ● JD  John Doe          Sales Manager    john@co.com  ● Active  ⋮  │
 │  ● SM  Sarah Miller      Director         sarah@co.com ● Active  ⋮  │
 │  ○ TP  Tom Park          Engineer         tom@co.com   ○ Inactive ⋮ │
 └──────────────────────────────────────────────────────────────────────┘
```

- Color-coded initials avatar `w-8 h-8 rounded-full`
- Status: Green pulsing dot for Active, gray for Inactive
- Row actions (`⋮`): Opens a dropdown with Edit / Toggle / Resend Email / Print Badge
- Cutoff lock: When past deadline, entire table shows a subtle amber banner + all edit actions are disabled with tooltip

### D. Badge Print Page (`/exhibitor/print-badge/[id]`)

Keep the 4×6 inch print format but modernize the badge design:

- **New badge layout**: More editorial, name in large `text-4xl font-bold`, event branding as a strip on the side (vertical orientation option)
- Add a subtle teal-to-emerald gradient header bar
- QR code: Rounded corners, with the event logo overlaid in the center of the QR
- Below QR: Booth number in monospace font, elegant separator

---

## 🎨 Updated Design Tokens

### Color System (Replace current `globals.css`)

```css
:root {
  /* Backgrounds */
  --background: oklch(0.99 0.002 240);
  --background-subtle: oklch(0.97 0.003 240);
  --surface: oklch(1 0 0);
  --surface-raised: oklch(0.985 0.002 240);

  /* Brand */
  --brand-primary: oklch(0.55 0.18 165); /* Emerald */
  --brand-primary-light: oklch(0.75 0.18 160);
  --brand-secondary: oklch(0.5 0.14 195); /* Teal */

  /* Text */
  --text-primary: oklch(0.13 0.005 240);
  --text-secondary: oklch(0.45 0.01 240);
  --text-muted: oklch(0.65 0.01 240);
  --text-disabled: oklch(0.8 0.005 240);

  /* Borders */
  --border-default: oklch(0.92 0.005 240);
  --border-subtle: oklch(0.95 0.002 240);
  --border-strong: oklch(0.8 0.01 240);

  /* Status */
  --status-success: oklch(0.55 0.18 145);
  --status-warning: oklch(0.7 0.17 65);
  --status-error: oklch(0.58 0.22 25);
  --status-info: oklch(0.58 0.15 240);
}

.dark {
  --background: oklch(0.1 0.015 245); /* Cold dark slate */
  --background-subtle: oklch(0.13 0.012 245);
  --surface: oklch(0.15 0.012 245);
  --surface-raised: oklch(0.18 0.01 245);

  --brand-primary: oklch(0.7 0.18 160);
  --brand-primary-light: oklch(0.8 0.15 155);
  --brand-secondary: oklch(0.65 0.14 195);

  --text-primary: oklch(0.96 0.005 240);
  --text-secondary: oklch(0.7 0.01 240);
  --text-muted: oklch(0.52 0.01 240);
  --text-disabled: oklch(0.35 0.008 240);

  --border-default: oklch(1 0 0 / 0.1);
  --border-subtle: oklch(1 0 0 / 0.06);
  --border-strong: oklch(1 0 0 / 0.2);
}
```

### Typography (Replace Inter with Geist)

```tsx
// app/layout.tsx
import localFont from 'next/font/local'

const geist = localFont({
  src: [{ path: './fonts/GeistVF.woff2', style: 'normal' }],
  variable: '--font-geist',
  display: 'swap',
})

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff2',
  variable: '--font-geist-mono',
  display: 'swap',
})
```

```css
/* Typography scale */
--font-display: var(--font-geist);
--font-body: var(--font-geist);
--font-mono: var(--font-geist-mono);

/* Usage for IDs, booth numbers, badge IDs */
.font-id {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.05em;
}
```

### Spacing & Radius

```css
/* More generous radius for modern feel */
--radius-sm: 0.375rem; /* 6px — inputs, small elements */
--radius-md: 0.625rem; /* 10px — cards, buttons */
--radius-lg: 1rem; /* 16px — panels, modals */
--radius-xl: 1.5rem; /* 24px — hero cards, login panel */
--radius-full: 9999px; /* Pills, avatars */
```

---

## ✨ Component Redesign Patterns

### Sidebar (`app-sidebar.tsx`)

```tsx
// Collapsible sidebar with icon rail
<aside
  className={cn(
    'border-border-subtle bg-surface flex h-screen flex-col border-r',
    'transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
    isCollapsed ? 'w-16' : 'w-[280px]'
  )}
>
  {/* Logo area */}
  <div className="border-border-subtle flex h-16 items-center border-b px-4">
    <Logo collapsed={isCollapsed} />
  </div>

  {/* Nav items with staggered mount animation */}
  <nav className="flex-1 space-y-1 p-3">
    {navItems.map((item, i) => (
      <NavItem
        key={item.href}
        {...item}
        collapsed={isCollapsed}
        style={{ animationDelay: `${i * 50}ms` }}
        className="animate-slide-in-left"
      />
    ))}
  </nav>

  {/* Collapse toggle */}
  <div className="border-border-subtle border-t p-3">
    <CollapseButton collapsed={isCollapsed} onToggle={toggle} />
  </div>
</aside>
```

### Stats Card (Bento Cell)

```tsx
<div
  className={cn(
    'group relative overflow-hidden rounded-2xl p-5',
    'bg-surface-raised border-border-subtle border',
    'hover:border-brand-primary/30 transition-all duration-200',
    'hover:shadow-brand-primary/5 hover:shadow-lg'
  )}
>
  {/* Subtle gradient background on hover */}
  <div className="from-brand-primary/5 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

  <div className="relative">
    <p className="text-text-muted mb-3 text-xs font-medium tracking-widest uppercase">
      {label}
    </p>
    <p className="text-text-primary font-id text-2xl font-semibold">{value}</p>
  </div>

  {/* Bottom accent line */}
  <div className="from-brand-primary to-brand-secondary absolute right-0 bottom-0 left-0 h-[2px] bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
</div>
```

### Form Input

```tsx
<div className="group space-y-1.5">
  <label className="text-text-muted text-[11px] font-semibold tracking-[0.08em] uppercase">
    {label}
  </label>
  <div className="relative">
    <input
      className={cn(
        'h-11 w-full rounded-xl px-4 text-sm',
        'bg-background-subtle border-border-default border',
        'text-text-primary placeholder:text-text-disabled',
        'transition-all duration-150',
        'focus:border-brand-primary/50 focus:outline-none',
        'focus:ring-brand-primary/15 focus:ring-2',
        'focus:bg-surface',
        // Glow on focus (dark mode)
        'dark:focus:shadow-[0_0_0_1px_var(--brand-primary),0_0_12px_var(--brand-primary)/20]'
      )}
    />
  </div>
</div>
```

### Primary Button

```tsx
<button
  className={cn(
    'relative inline-flex items-center justify-center gap-2',
    'h-10 rounded-xl px-5 text-sm font-semibold text-white',
    'bg-gradient-to-r from-emerald-600 to-teal-600',
    'shadow-md shadow-emerald-600/25',
    'transition-all duration-150',
    'hover:from-emerald-500 hover:to-teal-500',
    'hover:shadow-lg hover:shadow-emerald-600/30',
    'active:scale-[0.97]',
    // Shimmer effect
    'overflow-hidden',
    'before:absolute before:inset-0 before:-translate-x-full',
    'before:bg-gradient-to-r before:from-transparent before:via-white/15 before:to-transparent',
    'before:transition-transform before:duration-500 hover:before:translate-x-full'
  )}
>
  {children}
</button>
```

### Staff Status Badge

```tsx
// Active
<span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full
  bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
  Active
</span>

// Inactive
<span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full
  bg-muted/50 text-text-muted border border-border-subtle">
  <span className="w-1.5 h-1.5 rounded-full bg-text-disabled" />
  Inactive
</span>
```

### Cutoff Date Banner

```tsx
{
  isPastCutoff && (
    <div className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/8 px-4 py-3 text-amber-700 dark:text-amber-400">
      <LockIcon className="h-4 w-4 shrink-0" />
      <div>
        <p className="text-sm font-medium">Registration Closed</p>
        <p className="text-xs text-amber-600/80 dark:text-amber-500/80">
          The editing deadline (May 15, 2026) has passed. Contact support for
          changes.
        </p>
      </div>
    </div>
  )
}
```

---

## 📐 Layout Patterns

### Dashboard Grid

```tsx
// Bento-style dashboard
<div className="grid auto-rows-min grid-cols-12 gap-4">
  {/* Company info - large cell */}
  <div className="col-span-12 lg:col-span-7 xl:col-span-8">
    <CompanyInfoCard />
  </div>

  {/* Stats column */}
  <div className="col-span-12 grid grid-cols-2 gap-4 lg:col-span-5 xl:col-span-4">
    <StatsCell label="Username" value={username} className="col-span-2" />
    <StatsCell label="Booth" value={boothNo} />
    <StatsCell label="Staff" value={`${members.length}/${quota}`} />
  </div>

  {/* Staff management - full width */}
  <div className="col-span-12">
    <StaffManagementPanel />
  </div>
</div>
```

### Page Shell

```tsx
<div className="bg-background min-h-screen">
  {/* Noise texture overlay */}
  <div
    className="pointer-events-none fixed inset-0 z-50 opacity-[0.015]"
    style={{ backgroundImage: 'url(/noise.svg)' }}
  />

  <div className="flex h-screen overflow-hidden">
    <AppSidebar />

    <div className="flex flex-1 flex-col overflow-hidden">
      <PortalNavbar />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1280px] px-6 py-8">{children}</div>
      </main>
    </div>
  </div>
</div>
```

---

## 🌀 Animation System

```css
/* globals.css additions */

@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(100%);
  }
}

@keyframes count-up {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes progress-fill {
  from {
    width: 0%;
  }
  to {
    width: var(--progress-width);
  }
}

/* Tailwind config: extend theme.animation */
/* animate-slide-in-left: 'slide-in-left 0.3s ease both' */
/* animate-fade-up: 'fade-up 0.4s ease both' */
/* animate-shimmer: 'shimmer 0.6s ease' */
```

---

## 🚦 Responsive Breakpoints

| Breakpoint     | Width       | Layout                                                |
| -------------- | ----------- | ----------------------------------------------------- |
| Mobile (`sm`)  | < 640px     | Single column, no sidebar (drawer)                    |
| Tablet (`md`)  | 640–1024px  | Icon rail sidebar (64px), 1–2 col grid                |
| Desktop (`lg`) | 1024–1280px | Full sidebar (280px), 2–3 col bento                   |
| Wide (`xl`)    | > 1280px    | Full sidebar, full bento grid, max-w-[1280px] content |

---

## ✅ Implementation Checklist

### Phase 1 — Foundation

- [ ] Replace `globals.css` with new OKLCH color tokens
- [ ] Switch font from Inter → Geist (download from vercel.com/font)
- [ ] Update `tailwind.config.ts` with new colors, animations, radius tokens
- [ ] Add noise texture SVG to `/public/noise.svg`

### Phase 2 — Layout & Navigation

- [ ] Rebuild `app-sidebar.tsx` as collapsible rail
- [ ] Update `portal-navbar.tsx` with glassmorphism + monochrome links
- [ ] Implement page shell with noise overlay and max-width content area

### Phase 3 — Dashboard

- [ ] Convert exhibitor dashboard to bento grid layout
- [ ] Redesign stats cards with hover glow effects
- [ ] Add animated quota progress bar
- [ ] Redesign company info card with section tabs or grouped FieldSections

### Phase 4 — Forms & Interactions

- [ ] Update all Input components with new focus styles + glow
- [ ] Redesign buttons with shimmer hover effect
- [ ] Update Select, Dialog, Sheet with new tokens
- [ ] Cutoff date banner with amber locked state

### Phase 5 — Staff Management

- [ ] Redesign staff table with avatar initials, pulsing status dots
- [ ] Row action dropdown (⋮ menu) with Edit / Toggle / Resend / Print
- [ ] Add/Edit staff dialog with redesigned form
- [ ] Staggered row entrance animation on table mount

### Phase 6 — Login & Badge

- [ ] Redesign login page with split-panel layout + animated brand panel
- [ ] Modernize badge design with editorial typography + centered QR logo overlay
- [ ] Ensure print styles preserved for 4×6 inch output

### Phase 7 — Polish

- [ ] Add `framer-motion` or CSS-only staggered entrance animations
- [ ] Dark mode audit — every component looks premium in both modes
- [ ] Responsive audit — all pages tested on mobile, tablet, desktop
- [ ] Accessibility audit — focus states visible, ARIA labels intact

---

## 📦 Optional Additional Libraries

```bash
# If adding motion animations beyond CSS
npm install framer-motion@latest

# If adding sparkle/confetti on badge print success
npm install canvas-confetti

# Better toast notifications styling
# (sonner already installed — just update theme tokens)
```

---

## 🔗 Design References

- **Vercel Dashboard** (vercel.com) — Dark minimal B2B
- **Linear.app** — Keyboard-first, micro-interaction king
- **Stripe Dashboard** — Data-dense, premium feel
- **Resend.com** — Clean dark editorial UI
- **Raycast.com** — Motion + dark luxury
- **Awwwards 2025 winners** — Bento layouts, noise textures, cold darks

---

_This prompt was generated specifically for Expo Flow Manage Exhibitor based on PROJECT_ANALYSIS.md and STYLE_GUIDE.md_
_Target: Next.js 16 App Router · React 19 · Tailwind CSS 4 · shadcn/ui_

RULE:
responsive เต็มรูปแบบ โดยมีเงื่อนไขดังนี้:

**Layout & Breakpoints:**

- Mobile: < 768px → single column, hamburger menu
- Tablet: 768px–1024px → 2 columns, compact nav
- Desktop: > 1024px → full layout, horizontal nav

**เทคโนโลยี:**

- ใช้ [Nextjs + Tailwind CSS]
- CSS: ใช้ mobile-first (min-width) ไม่ใช่ max-width
- ห้ามใช้ fixed width เป็น px สำหรับ container หลัก

**เนื้อหาในหน้า:**

- [ระบุ section ที่ต้องการ เช่น Hero, Features, Pricing, Footer]

**UI/UX:**

- Font ต้องอ่านง่ายบน mobile (min 16px)
- ปุ่มและ touch target ต้องใหญ่พอสำหรับนิ้วมือ (min 44x44px)
- รูปภาพใช้ max-width: 100% ทุกรูป

**Accessibility:**

- ใส่ alt text ให้รูปภาพ
- ใช้ semantic HTML (header, main, section, footer)
- Color contrast ผ่านมาตรฐาน WCAG AA
