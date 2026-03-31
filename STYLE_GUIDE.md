# Expo Flow Manage Exhibitor - Style & Design Guide

## 📋 Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Component Styles](#component-styles)
6. [Animations & Transitions](#animations--transitions)
7. [Dark Mode Implementation](#dark-mode-implementation)
8. [Print Styles](#print-styles)
9. [Responsive Design](#responsive-design)
10. [Visual Hierarchy](#visual-hierarchy)
11. [Icon System](#icon-system)
12. [Form Design](#form-design)
13. [Card Patterns](#card-patterns)
14. [Button Styles](#button-styles)
15. [Glassmorphism Effects](#glassmorphism-effects)

---

## 🎨 Design Philosophy

### Core Principles

1. **Clean & Professional**: Minimalist design with focus on content
2. **Consistent**: Unified design language across all components
3. **Accessible**: WCAG compliant with proper contrast ratios
4. **Modern**: Contemporary UI with subtle animations
5. **Functional**: Form follows function - beauty through usability

### Design Inspiration

- **shadcn/ui New York Style**: Clean, minimal, professional
- **Material Design**: Clear hierarchy, meaningful animations
- **Apple Human Interface**: Simplicity, clarity, depth

### Brand Identity

**Primary Brand Colors**:
- Emerald Green (`hsl(180 25% 25%)`): Represents growth, harmony, sustainability
- Teal Accent: Modern, professional, trustworthy

**Event Branding**:
- ILDEX Vietnam 2026
- Horti & Agri Vietnam 2026
- Bangkok 2026

---

## 🌈 Color System

### CSS Variables (Light Mode)

```css
:root {
  /* Core Colors */
  --background: oklch(1 0 0);              /* Pure white */
  --foreground: oklch(0.145 0 0);          /* Near black */
  
  /* Surface Colors */
  --card: oklch(1 0 0);                    /* White cards */
  --card-foreground: oklch(0.145 0 0);     /* Black text on cards */
  --popover: oklch(1 0 0);                 /* White popovers */
  --popover-foreground: oklch(0.145 0 0);  /* Black text on popovers */
  
  /* Primary Brand */
  --primary: hsl(180 25% 25%);            /* Deep teal - main brand */
  --primary-foreground: hsl(0 0% 100%);   /* White on primary */
  
  /* Secondary */
  --secondary: oklch(0.97 0 0);           /* Light gray */
  --secondary-foreground: oklch(0.205 0 0);
  
  /* Muted */
  --muted: oklch(0.97 0 0);               /* Subtle backgrounds */
  --muted-foreground: oklch(0.556 0 0);   /* Gray text */
  
  /* Accent */
  --accent: oklch(0.97 0 0);              /* Hover states */
  --accent-foreground: oklch(0.205 0 0);
  
  /* Destructive */
  --destructive: oklch(0.577 0.245 27.325); /* Red for errors */
  
  /* Borders & Inputs */
  --border: oklch(0.922 0 0);             /* Light gray borders */
  --input: oklch(0.922 0 0);              /* Input backgrounds */
  --ring: oklch(0.708 0 0);               /* Focus rings */
  
  /* Charts */
  --chart-1: oklch(0.646 0.222 41.116);   /* Amber */
  --chart-2: oklch(0.6 0.118 184.704);    /* Teal */
  --chart-3: oklch(0.398 0.07 227.392);   /* Blue */
  --chart-4: oklch(0.828 0.189 84.429);   /* Yellow */
  --chart-5: oklch(0.769 0.188 70.08);    /* Orange */
  
  /* Sidebar */
  --sidebar: oklch(0.985 0 0);            /* Very light gray */
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  
  /* Radius Scale */
  --radius: 0.625rem;                     /* Base radius */
}
```

### CSS Variables (Dark Mode)

```css
.dark {
  --background: oklch(0.145 0 0);         /* Near black */
  --foreground: oklch(0.985 0 0);         /* White */
  
  --card: oklch(0.205 0 0);               /* Dark gray cards */
  --card-foreground: oklch(0.985 0 0);
  
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  
  --primary: hsl(180 25% 35%);            /* Lighter teal for dark mode */
  --primary-foreground: hsl(0 0% 100%);
  
  --secondary: oklch(0.269 0 0);          /* Dark gray */
  --secondary-foreground: oklch(0.985 0 0);
  
  --muted: oklch(0.269 0 0);              /* Dark muted */
  --muted-foreground: oklch(0.708 0 0);   /* Light gray text */
  
  --accent: oklch(0.269 0 0);             /* Dark accent */
  --accent-foreground: oklch(0.985 0 0);
  
  --destructive: oklch(0.704 0.191 22.216); /* Brighter red */
  
  --border: oklch(1 0 0 / 10%);           /* Subtle white border */
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  
  /* Sidebar dark variants */
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
}
```

### Custom Brand Colors

#### Emerald Gradient (Primary CTA)
```css
/* Light Mode */
background: linear-gradient(135deg, 
  hsl(170 40% 20%) 0%, 
  hsl(180 30% 28%) 50%, 
  hsl(160 35% 22%) 100%
);

/* Dark Mode */
background: linear-gradient(135deg, 
  hsl(170 35% 12%) 0%, 
  hsl(180 25% 16%) 50%, 
  hsl(160 30% 10%) 100%
);
```

#### Emerald Button Gradient
```css
background: linear-gradient(to right, 
  from-emerald-600, 
  to-teal-600
);
hover: linear-gradient(to right, 
  from-emerald-500, 
  to-teal-500
);
```

#### Icon Background Colors
```css
/* Emerald Icon Background */
bg-emerald-500/10 text-emerald-600 dark:text-emerald-400

/* Blue Icon Background */
bg-blue-500/10 text-blue-600 dark:text-blue-400

/* Amber Icon Background */
bg-amber-500/10 text-amber-600 dark:text-amber-400
```

### Color Usage Guidelines

| Use Case | Color | Variable |
|----------|-------|----------|
| Primary Actions | Emerald/Teal | `--primary` |
| Secondary Actions | Gray | `--secondary` |
| Destructive Actions | Red | `--destructive` |
| Links | Emerald | Custom |
| Success States | Green | Custom |
| Warning States | Amber | Custom |
| Info States | Blue | Custom |

### Contrast Ratios

All text meets WCAG AA standards:
- **Normal text**: Minimum 4.5:1 contrast
- **Large text**: Minimum 3:1 contrast
- **UI components**: Minimum 3:1 contrast

---

## 📝 Typography

### Font Family

```css
@theme inline {
  --font-sans: var(--font-inter);
  --font-mono: var(--font-inter);
}
```

**Primary Font**: Inter
- Clean, modern, highly readable
- Multiple weights: 300, 400, 500, 600, 700
- Excellent for UI and long-form text

### Font Size Scale

| Class | Size | Usage |
|-------|------|-------|
| `text-[10px]` | 10px | Micro labels, badges |
| `text-xs` | 0.75rem | Small labels, hints |
| `text-sm` | 0.875rem | Secondary text, descriptions |
| `text-base` | 1rem | Body text (default) |
| `text-lg` | 1.125rem | Subheadings |
| `text-xl` | 1.25rem | Section titles |
| `text-2xl` | 1.5rem | Page titles |
| `text-3xl` | 1.875rem | Hero text |
| `text-4xl` | 2.25rem | Large headings |

### Font Weights

| Class | Weight | Usage |
|-------|--------|-------|
| `font-light` | 300 | Delicate text (rare) |
| `font-normal` | 400 | Body text |
| `font-medium` | 500 | Emphasized text |
| `font-semibold` | 600 | Subheadings, buttons |
| `font-bold` | 700 | Headings, important text |
| `font-black` | 900 | Hero text, badges |

### Letter Spacing (Tracking)

```css
/* Tight tracking for large text */
tracking-tight      /* -0.025em */

/* Normal tracking */
tracking-normal     /* 0em */

/* Wide tracking for small text */
tracking-wide       /* 0.025em */
tracking-wider      /* 0.05em */
tracking-widest     /* 0.1em */
tracking-[0.2em]    /* 0.2em (custom) */
tracking-[0.3em]    /* 0.3em (custom) */
```

### Line Height

```css
leading-none        /* 1 */
leading-tight       /* 1.25 */
leading-snug        /* 1.375 */
leading-normal      /* 1.5 */
leading-relaxed     /* 1.625 */
leading-loose       /* 2 */
```

### Typography Patterns

#### Page Header
```tsx
<h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
  {companyName}
</h1>
```

#### Section Title
```tsx
<h2 className="text-lg font-bold text-foreground flex items-center gap-2">
  <Icon className="h-4.5 w-4.5" />
  Section Title
</h2>
```

#### Label (Form)
```tsx
<Label className="text-[10px] text-muted-foreground uppercase font-medium tracking-wide">
  Label Text
</Label>
```

#### Badge Text
```tsx
<span className="text-3xl font-black uppercase tracking-[0.3em] leading-none">
  EXHIBITOR
</span>
```

---

## 📐 Spacing & Layout

### Spacing Scale

| Class | Value | Usage |
|-------|-------|-------|
| `gap-1` | 0.25rem | Tight spacing |
| `gap-1.5` | 0.375rem | Icon + text |
| `gap-2` | 0.5rem | Related items |
| `gap-3` | 0.75rem | Group items |
| `gap-4` | 1rem | Section spacing |
| `gap-6` | 1.5rem | Large gaps |
| `gap-8` | 2rem | Major sections |

### Padding Patterns

#### Card Padding
```tsx
<CardContent className="p-5">     {/* Standard card */}
<CardContent className="p-8">     {/* Spacious card */}
```

#### Section Padding
```tsx
<main className="portal-main">
  padding: 2rem 1.5rem 4rem;
</main>
```

#### Form Field Padding
```tsx
<div className="space-y-2">       {/* Label + Input */}
  <Label />
  <Input />
</div>
```

### Layout Containers

#### Main Content
```css
.w-full max-w-full mx-auto
```

#### Portal Navbar
```css
.portal-navbar-inner {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 1.5rem;
}
```

#### Centered Content
```tsx
<div className="flex h-[60vh] items-center justify-center">
  <div className="text-center">
    {/* Content */}
  </div>
</div>
```

### Grid Systems

#### Stats Cards (3 columns)
```tsx
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
  <StatsCard />
  <StatsCard />
  <StatsCard />
</div>
```

#### Form Fields (2 columns)
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
  {/* Form fields */}
</div>
```

#### Company Info (3 columns on large screens)
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <FieldSection />
  <FieldSection />
  <FieldSection />
</div>
```

---

## 🧩 Component Styles

### Buttons

#### Primary Button (Gradient)
```tsx
<Button 
  className="rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 
             hover:from-emerald-500 hover:to-teal-500 
             text-white gap-2 shadow-md shadow-emerald-600/20"
>
  <Save className="h-4 w-4" />
  Save Changes
</Button>
```

**Properties**:
- Gradient: `from-emerald-600 to-teal-600`
- Hover: `from-emerald-500 hover:to-teal-500`
- Shadow: `shadow-md shadow-emerald-600/20`
- Radius: `rounded-lg`

#### Secondary Button (Outline)
```tsx
<Button variant="outline" className="rounded-lg">
  Cancel
</Button>
```

#### Ghost Button
```tsx
<Button variant="ghost" size="icon" className="h-9 w-9 rounded-md">
  <Icon className="h-4 w-4" />
</Button>
```

#### Button with Icon
```tsx
<Button className="gap-2">
  <Icon className="h-4 w-4" />
  Button Text
</Button>
```

#### Full Width Button
```tsx
<Button className="w-full h-12 rounded-2xl">
  Sign In
</Button>
```

### Cards

#### Standard Card
```tsx
<Card className="overflow-hidden">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Description text</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

#### Card with Gradient Top Border
```tsx
<Card className="overflow-hidden">
  <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
  <CardHeader>
    {/* Header */}
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

#### Card with Hover Effect
```tsx
<Card className="border-border/50 hover:border-border transition-colors duration-200">
  {/* Content */}
</Card>
```

### Inputs

#### Standard Input
```tsx
<Input 
  className="h-10 rounded-lg border-border/60 bg-muted/30 
             focus:bg-background focus:border-emerald-500/50 
             focus:ring-4 focus:ring-emerald-500/5 
             transition-all duration-300"
/>
```

**Focus State**:
- Background: `bg-background`
- Border: `border-emerald-500/50`
- Ring: `ring-4 ring-emerald-500/5`
- Transition: `transition-all duration-300`

#### Large Input (Login)
```tsx
<Input 
  className="h-12 rounded-2xl bg-muted/30 border-border/60 
             focus:bg-background focus:border-emerald-500/50 
             focus:ring-4 focus:ring-emerald-500/5"
/>
```

### Badges

#### Default Badge
```tsx
<Badge>Default</Badge>
```

#### Outline Badge
```tsx
<Badge variant="outline" className="text-emerald-700 dark:text-emerald-400 
                                    border-emerald-300 dark:border-emerald-700 
                                    bg-emerald-50 dark:bg-emerald-950/30">
  Editing Open
</Badge>
```

#### Destructive Badge
```tsx
<Badge variant="destructive" className="gap-1.5">
  <Lock className="h-3 w-3" />
  Locked
</Badge>
```

### Tables

#### Staff Table
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Badge ID</TableHead>
      <TableHead>Title</TableHead>
      <TableHead>Full Name</TableHead>
      <TableHead>Position</TableHead>
      <TableHead>Contact</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-mono text-sm">ABC123</TableCell>
      <TableCell>Mr.</TableCell>
      <TableCell className="font-medium">John Doe</TableCell>
      <TableCell>Manager</TableCell>
      <TableCell>
        <div className="text-sm">email@example.com</div>
        <div className="text-xs text-muted-foreground">+66 123 4567</div>
      </TableCell>
      <TableCell>
        <Badge variant="default">Active</Badge>
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Dialogs

#### Standard Dialog
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle className="text-xl">Dialog Title</DialogTitle>
      <DialogDescription>
        Description text here.
      </DialogDescription>
    </DialogHeader>
    <form className="mt-2">
      {/* Form fields */}
    </form>
    <DialogFooter className="mt-6 border-t pt-4">
      <Button type="submit">Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Progress Bars

#### Quota Progress
```tsx
<Progress
  value={(staffCount / totalQuota) * 100}
  className="h-2 rounded-full"
  indicatorColor={isQuotaFull ? "bg-red-500" : "bg-blue-500"}
/>
```

### Avatars

#### User Avatar
```tsx
<Avatar className="h-7 w-7 ring-2 ring-emerald-500/20">
  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs font-bold">
    EX
  </AvatarFallback>
</Avatar>
```

---

## ✨ Animations & Transitions

### Custom Animations (globals.css)

#### Fade In Up
```css
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out both;
}
```

#### Fade In
```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fade-in 0.4s ease-out both;
}
```

#### Scale In
```css
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scale-in 0.4s ease-out both;
}
```

### Staggered Animation Delays

```css
.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }
.delay-400 { animation-delay: 400ms; }
.delay-500 { animation-delay: 500ms; }
```

### Usage Example

```tsx
<div className="space-y-8">
  {/* Header - First */}
  <div className="animate-fade-in-up">
    <h1>Page Title</h1>
  </div>

  {/* Stats Cards - Second */}
  <div className="grid grid-cols-3 gap-4 animate-fade-in-up delay-100">
    <StatsCard />
    <StatsCard />
    <StatsCard />
  </div>

  {/* Company Info - Third */}
  <Card className="animate-fade-in-up delay-200">
    {/* Content */}
  </Card>

  {/* Staff Management - Fourth */}
  <div className="animate-fade-in-up delay-300">
    <PortalStaffManagement />
  </div>
</div>
```

### Transition Classes

#### Button Transitions
```tsx
<Button className="transition-all duration-300 
                   hover:shadow-emerald-500/30 
                   hover:scale-[1.02]">
  Button
</Button>
```

#### Icon Transitions
```tsx
<ArrowRight className="transition-transform group-hover:translate-x-1" />
```

#### Card Transitions
```tsx
<Card className="transition-colors duration-200 
                 hover:border-border">
  Content
</Card>
```

### Loading Spinner

```tsx
<Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
```

---

## 🌓 Dark Mode Implementation

### Theme Provider

```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="light"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

### Theme Toggle Component

```tsx
export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}
```

### Dark Mode Color Adjustments

#### Background Elements
```css
/* Light Mode */
bg-card text-card-foreground

/* Dark Mode */
dark:bg-card dark:text-card-foreground
```

#### Subtle Backgrounds
```css
bg-emerald-50 dark:bg-emerald-950/30
bg-blue-50 dark:bg-blue-950/20
bg-muted/20 dark:bg-muted/30
```

#### Borders
```css
border-border/50 dark:border-border/30
border-emerald-300 dark:border-emerald-700
```

#### Text Colors
```css
text-emerald-700 dark:text-emerald-400
text-blue-700 dark:text-blue-400
text-muted-foreground/60 dark:text-muted-foreground/80
```

### Dark Mode Specific Styles

#### Login Page Gradient
```css
/* Light Mode */
.login-gradient-bg {
  background: linear-gradient(
    135deg,
    hsl(170 40% 20%) 0%,
    hsl(180 30% 28%) 50%,
    hsl(160 35% 22%) 100%
  );
}

/* Dark Mode */
.dark .login-gradient-bg {
  background: linear-gradient(
    135deg,
    hsl(170 35% 12%) 0%,
    hsl(180 25% 16%) 50%,
    hsl(160 30% 10%) 100%
  );
}
```

#### Glassmorphism (Dark Mode)
```css
bg-card/30 backdrop-blur-xl border border-border/50
```

---

## 🖨 Print Styles

### Badge Print CSS

```css
@media print {
  @page {
    size: 4in 6in;
    margin: 0;
  }
  
  body {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
    margin: 0;
    padding: 0;
  }
  
  .print-badge {
    box-shadow: none !important;
    border: none !important;
    width: 4in !important;
    height: 6in !important;
    margin: 0 !important;
    position: absolute;
    top: 0;
    left: 0;
    break-after: page;
  }
  
  body > *:not(.print-area) {
    display: none !important;
  }
  
  .print-area {
    display: block !important;
    margin: 0 !important;
    padding: 0 !important;
    width: 4in !important;
    height: 6in !important;
  }
}
```

### Print Badge Component Styles

```tsx
<div className="print-badge w-[4in] h-[6in] bg-white flex flex-col items-center text-center mx-auto mb-8 break-after-page relative overflow-hidden shadow-lg border border-gray-100 print:shadow-none print:border-none">
  {/* Category Header */}
  <div className="w-full bg-emerald-600 h-16 flex items-center justify-center print:bg-emerald-600">
    <span className="text-white text-3xl font-black uppercase tracking-[0.3em] leading-none">
      EXHIBITOR
    </span>
  </div>

  {/* Event Header */}
  <div className="w-full pt-8 px-6">
    <div className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700/60 mb-1">
      Expo Flow Management
    </div>
    <div className="h-[2px] w-12 bg-emerald-600 mx-auto opacity-30 print:opacity-100"></div>
    <div className="text-xs font-medium text-slate-400 mt-2 uppercase tracking-widest">
      Bangkok 2026
    </div>
  </div>

  {/* Staff Identity */}
  <div className="w-full flex-1 flex flex-col justify-center px-6 py-4">
    <div className="space-y-1">
      <h1 className="text-4xl font-black text-slate-900 leading-[1.1] mb-2 px-2 break-words">
        {staff.title} {staff.first_name}<br />
        {staff.last_name}
      </h1>
      <div className="inline-block px-4 py-1 bg-slate-100 rounded-full print:bg-slate-100">
        <h2 className="text-lg text-slate-600 font-bold uppercase tracking-wide">
          {staff.job_position || 'Staff'}
        </h2>
      </div>
    </div>

    <div className="mt-8 space-y-1 bg-slate-50/50 py-4 px-4 rounded-xl border border-slate-100/50 print:bg-slate-50">
      <h3 className="text-xl text-emerald-800 font-black uppercase tracking-tight leading-tight">
        {exhibitor.company_name}
      </h3>
      <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">
        {exhibitor.country}
      </p>
    </div>
  </div>

  {/* Footer / QR */}
  <div className="w-full bg-slate-50 px-6 py-8 flex flex-col items-center gap-6 border-t border-slate-100 print:bg-slate-50">
    <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 print:shadow-none">
      <QRCodeSVG value={staff.member_uuid} size={110} level="H" />
    </div>

    <div className="flex items-center gap-6 w-full justify-center">
      <div className="text-left">
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Booth No.</div>
        <div className="text-xl font-black text-emerald-600 tracking-tighter">{exhibitor.booth_no}</div>
      </div>
      <div className="h-8 w-[1px] bg-slate-200 print:bg-slate-200"></div>
      <div className="text-right">
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Badge ID</div>
        <div className="text-sm font-mono font-bold text-slate-700">{staff.registration_code}</div>
      </div>
    </div>
  </div>
</div>
```

### Print-Specific Font

```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');

.print-badge {
  font-family: 'Outfit', sans-serif !important;
}
```

---

## 📱 Responsive Design

### Breakpoints

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| `sm` | 640px | Small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### Responsive Patterns

#### Page Header
```tsx
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
  <div>
    <h1 className="text-2xl sm:text-3xl font-bold">Title</h1>
  </div>
  <div className="flex items-center gap-3">
    <Badge>Status</Badge>
  </div>
</div>
```

#### Stats Cards
```tsx
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
  <StatsCard />
  <StatsCard />
  <StatsCard />
</div>
```

#### User Menu
```tsx
<span className="text-sm font-medium text-foreground hidden sm:inline-block">
  {user?.username}
</span>
```

#### Form Fields
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Fields */}
</div>
```

#### Buttons
```tsx
<div className="flex flex-col sm:flex-row justify-end gap-3">
  <Button className="order-2 sm:order-1">Cancel</Button>
  <Button className="order-1 sm:order-2">Save</Button>
</div>
```

#### Navbar
```tsx
<div className="portal-navbar-inner">
  <div className="flex items-center gap-3">
    <div className="flex items-center justify-center w-9 h-9 rounded-xl">
      <Logo />
    </div>
    <div className="flex flex-col">
      <span className="text-sm font-bold">Exhibitor Portal</span>
      <span className="text-[10px] hidden sm:block">
        ILDEX Vietnam 2026
      </span>
    </div>
  </div>
</div>
```

### Mobile-First Approach

```tsx
// Base styles for mobile
<div className="flex flex-col gap-4">
  {/* Override for larger screens */}
  <div className="sm:flex sm:flex-row sm:gap-6">
    {/* Content */}
  </div>
</div>
```

---

## 🎯 Visual Hierarchy

### Hierarchy Levels

#### Level 1: Page Title
```tsx
<h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
  Company Name
</h1>
```

#### Level 2: Section Title with Icon
```tsx
<CardTitle className="flex items-center gap-2 text-lg font-bold">
  <Building2 className="h-4.5 w-4.5 text-emerald-600" />
  Company Information
</CardTitle>
```

#### Level 3: Subsection Title
```tsx
<h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
  <Mail className="h-3.5 w-3.5" />
  Contact Info
</h3>
```

#### Level 4: Field Label
```tsx
<Label className="text-[10px] text-muted-foreground uppercase font-medium tracking-wide">
  Email Address
</Label>
```

#### Level 5: Field Value
```tsx
<div className="text-sm font-medium flex items-center gap-1.5">
  <Mail className="h-3 w-3 text-muted-foreground" />
  email@example.com
</div>
```

### Visual Weight

| Element | Font Size | Font Weight | Color |
|---------|-----------|-------------|-------|
| Page Title | 2xl-3xl | Bold | Foreground |
| Section Title | lg | Bold | Foreground |
| Subsection | 11px | Bold | Muted Foreground |
| Label | 10px | Medium | Muted Foreground |
| Value | sm | Medium | Foreground |
| Description | xs | Normal | Muted Foreground |

---

## 🎭 Icon System

### Icon Library: Lucide React

```tsx
import { Building2, Mail, Phone, Globe, MapPin, Lock, Save, Pencil } from 'lucide-react'
```

### Icon Sizes

| Usage | Size Class | Dimensions |
|-------|------------|------------|
| Large (Stats) | `h-5 w-5` | 20px |
| Medium (Buttons) | `h-4 w-4` | 16px |
| Small (Labels) | `h-3.5 w-3.5` | 14px |
| Tiny (Inline) | `h-3 w-3` | 12px |

### Icon Patterns

#### Icon with Background
```tsx
<div className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600">
  <Building2 className="h-5 w-5" />
</div>
```

#### Icon in Button
```tsx
<Button className="gap-2">
  <Save className="h-4 w-4" />
  Save
</Button>
```

#### Icon with Label
```tsx
<h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
  <Mail className="h-3.5 w-3.5" />
  Contact Info
</h3>
```

#### Icon as Bullet
```tsx
<div className="flex items-center gap-1.5">
  <Phone className="h-3 w-3 text-muted-foreground" />
  <span>+66 2 123 4567</span>
</div>
```

#### Gradient Icon Container
```tsx
<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
  <Building2 className="h-5 w-5" />
</div>
```

---

## 📋 Form Design

### Form Field Pattern

```tsx
<div className="space-y-2">
  <Label htmlFor="email" className="text-[10px] text-muted-foreground uppercase font-medium tracking-wide">
    Email Address
  </Label>
  <Input
    id="email"
    type="email"
    value={value}
    onChange={e => setValue(e.target.value)}
    className="h-10 rounded-lg bg-muted/30 border-border/60 focus:bg-background focus:border-emerald-500/50"
    placeholder="email@example.com"
  />
</div>
```

### Form Field with Icon

```tsx
<div className="space-y-1">
  <Label>Email</Label>
  <div className="text-sm font-medium flex items-center gap-1.5">
    <Mail className="h-3 w-3 text-muted-foreground" />
    email@example.com
  </div>
</div>
```

### Form Field with Link

```tsx
<FieldItem
  label="Website"
  value={website}
  editing={false}
  icon={<Globe className="h-3 w-3 text-muted-foreground" />}
  isLink
/>
```

### Required Field Indicator

```tsx
<Label htmlFor="first_name">
  First Name <span className="text-red-500">*</span>
</Label>
```

### Form Grid Layout

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
  <div className="space-y-2">
    <Label>First Name</Label>
    <Input />
  </div>
  <div className="space-y-2">
    <Label>Last Name</Label>
    <Input />
  </div>
</div>
```

### Form Actions

```tsx
<div className="flex flex-col sm:flex-row justify-end gap-3 border-t pt-5">
  <Button variant="ghost" className="order-2 sm:order-1">
    Cancel
  </Button>
  <Button className="order-1 sm:order-2">
    Save Changes
  </Button>
</div>
```

### Select with Custom Options

```tsx
<Select value={title} onValueChange={setTitle}>
  <SelectTrigger className="w-[120px]">
    <SelectValue placeholder="Select" />
  </SelectTrigger>
  <SelectContent>
    {['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.', 'Miss'].map(t => (
      <SelectItem key={t} value={t}>{t}</SelectItem>
    ))}
    <SelectItem value="Other">Other</SelectItem>
  </SelectContent>
</Select>
```

---

## 🃏 Card Patterns

### Stats Card

```tsx
<Card className="overflow-hidden border-border/50 hover:border-border transition-colors duration-200">
  <CardContent className="flex items-center p-5 gap-4">
    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
      <Hash className="h-5 w-5" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs font-medium text-muted-foreground mb-0.5">Username</p>
      <p className="text-xl font-bold tracking-tight truncate">EB001</p>
    </div>
  </CardContent>
</Card>
```

### Info Card with Sections

```tsx
<Card className="overflow-hidden">
  <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
  <CardHeader className="flex flex-row items-center justify-between">
    <div>
      <CardTitle className="flex items-center gap-2">
        <Building2 className="h-4.5 w-4.5 text-emerald-600" />
        Company Information
      </CardTitle>
      <CardDescription>Your company profile and contact details.</CardDescription>
    </div>
    <Button variant="outline" size="sm">
      <Pencil className="h-3 w-3" />
      Edit
    </Button>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <FieldSection icon={<Building2 />} title="Basic Details">
        <FieldItem label="Company Name" value={companyName} />
        <FieldItem label="Booth No." value={boothNo} />
      </FieldSection>
      {/* More sections */}
    </div>
  </CardContent>
</Card>
```

### Alert Card

```tsx
<div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-xl p-4">
  <div className="flex items-start gap-3">
    <div className="mt-0.5 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
      <AlertTriangle className="h-3 w-3 text-blue-600 dark:text-blue-400" />
    </div>
    <div className="space-y-1.5 text-sm">
      <p className="text-blue-800 dark:text-blue-300 font-medium">
        Important information here.
      </p>
      <ul className="list-disc list-inside text-muted-foreground text-xs space-y-1 ml-1">
        <li>Bullet point 1</li>
        <li>Bullet point 2</li>
      </ul>
    </div>
  </div>
</div>
```

---

## 🔘 Button Styles

### Button Variants

#### Primary (Gradient)
```tsx
<Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/20">
  Primary Action
</Button>
```

#### Secondary (Outline)
```tsx
<Button variant="outline">
  Secondary Action
</Button>
```

#### Ghost
```tsx
<Button variant="ghost">
  Ghost Action
</Button>
```

#### Destructive
```tsx
<Button variant="destructive">
  Delete
</Button>
```

### Button Sizes

```tsx
<Button size="sm">Small</Button>      {/* h-9 */}
<Button size="default">Default</Button> {/* h-10 */}
<Button size="lg">Large</Button>      {/* h-11 */}
<Button size="icon">Icon Only</Button> {/* Square */}
```

### Button States

#### Loading
```tsx
<Button disabled>
  <Loader2 className="h-4 w-4 animate-spin" />
  Loading...
</Button>
```

#### With Icon
```tsx
<Button className="gap-2">
  <Save className="h-4 w-4" />
  Save
</Button>
```

#### Icon Animation on Hover
```tsx
<Button className="group">
  Next
  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
</Button>
```

---

## 💎 Glassmorphism Effects

### Login Form Glassmorphism

```tsx
<div className="bg-card/30 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-2xl shadow-emerald-500/5">
  {/* Form content */}
</div>
```

### Portal Navbar Glassmorphism

```css
.portal-navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  height: 3.75rem;
  border-bottom: 1px solid var(--border);
  background: oklch(from var(--background) l c h / 80%);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
}
```

### Glassmorphism Properties

| Property | Value | Purpose |
|----------|-------|---------|
| `bg-card/30` | 30% opacity | Transparency |
| `backdrop-blur-xl` | 24px blur | Blur effect |
| `border-border/50` | 50% opacity | Subtle border |
| `shadow-2xl` | Large shadow | Depth |
| `shadow-emerald-500/5` | Colored shadow | Brand tint |

---

## 📊 Summary

This design system provides:

✅ **Consistent Visual Language**: Unified colors, typography, and spacing
✅ **Accessible Design**: WCAG compliant contrast ratios
✅ **Responsive**: Mobile-first approach with breakpoints
✅ **Dark Mode**: Full dark mode support with proper color adjustments
✅ **Print Ready**: Optimized badge printing styles
✅ **Modern Animations**: Subtle, meaningful transitions
✅ **Reusable Patterns**: Component patterns for consistency

The style guide ensures that all UI elements maintain visual coherence while providing flexibility for different use cases across the application.
