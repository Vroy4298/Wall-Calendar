# 📅 Wall Calendar Planner

A **production-quality, interactive wall calendar component** built with Next.js 15, TypeScript, TailwindCSS, and Framer Motion. Built for the Frontend Engineering Assessment.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://wall-calendar.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

---

## ✨ Features

### 🗓 Core Calendar
- **Monthly calendar grid** — 6-week layout with adjacent-month padding
- **Month navigation** — animated prev/next transitions with directional slide
- **Today indicator** — clearly highlighted with accent colour ring
- **Holiday markers** — 14 US & cultural holidays with emoji icons

### 🖱 Date Range Selection
- **Click-to-select** — click a start date, click an end date
- **Drag-to-select** — hold and drag across days
- **Hover preview** — shows the range before confirming
- **Range preview badge** — floating indicator showing "Apr 5 → Apr 12 (8 days)"
- **Clear selection** — `Esc` key or the ✕ button

### 🖼 Hero Image Panel
- **12 monthly themes** — curated Unsplash photos (winter → spring → summer → autumn)
- **Dynamic colour theming** — CSS variables updated from image dominant colour via canvas
- **Crossfade animation** — smooth image transition on month change
- **Month + year overlay** — elegant typography on gradient backdrop

### 📝 Integrated Notes
- **Monthly memo** — free-text note for the whole month
- **Range notes** — attach notes to any selected date range, with a date label
- **Note indicators** — subtle dot on day cells that have notes
- **Collapsible sections** — range notes accordion with count badge

### 🎨 Design & UX
- **Dark / light mode** — toggle button, persisted in localStorage
- **Dynamic accent colour** — hero image drives the whole colour theme (CSS vars)
- **Framer Motion animations** — month flip, hover scale, range spread, note popups
- **Keyboard navigation** — Arrow keys, Enter to select, Escape to clear
- **Swipe gestures** — swipe left/right on mobile to change month
- **Responsive layout** — side-by-side (desktop) → stacked (mobile)

### 💾 Persistence
All user data persisted in `localStorage`:
- Current month
- Selected date range
- Monthly notes
- Range notes
- Dark mode preference

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | Framework & routing |
| TypeScript 5 | Type safety |
| TailwindCSS 4 | Utility styling |
| Framer Motion | Animations |
| date-fns | Date arithmetic |
| clsx | Class composition |
| Lucide React | Icons |

---

## 🏗 Architecture

```
wall-calendar/
├── app/
│   ├── layout.tsx          # Root layout, Inter font, metadata
│   ├── page.tsx            # Entry point → <Calendar />
│   └── globals.css         # CSS variables, design tokens, dark mode
│
├── components/
│   ├── Calendar.tsx        # Root orchestrator, state wiring, layout
│   ├── CalendarGrid.tsx    # 7-col grid, month animations, keyboard nav
│   ├── DayCell.tsx         # Individual day — all visual states (memo'd)
│   ├── MonthNavigator.tsx  # Prev/Next/Today buttons + dark mode toggle
│   ├── HeroImage.tsx       # Monthly themed image + colour extraction
│   ├── NotesPanel.tsx      # Monthly memo + range notes CRUD
│   └── RangePreview.tsx    # Floating range badge
│
├── hooks/
│   ├── useCalendar.ts      # Month navigation state
│   ├── useRangeSelection.ts # Click + drag selection logic
│   └── useLocalStorage.ts  # Generic typed localStorage hook
│
├── utils/
│   ├── dateHelpers.ts      # isSameDay, isInRange, formatRange…
│   ├── calendarHelpers.ts  # buildCalendarGrid, WEEKDAY_LABELS
│   └── holidays.ts         # Static holiday map (MM-DD → name + emoji)
│
└── types/
    └── calendar.ts         # Shared TypeScript interfaces
```

### Design Decisions

- **CSS Variables for theming**: `--accent` is overwritten at runtime by canvas colour extraction from the hero image. All components reference `rgb(var(--accent))` so the whole UI reacts.
- **`DayCell` is `memo()`'d**: Prevents the 42-cell grid from re-rendering on every mouse event.
- **Framer Motion `AnimatePresence` on grid**: The direction of navigation (prev/next) drives the slide direction via a custom variant.
- **No backend**: All data lives in `localStorage`. The app is fully static.

---

## 🚀 Running Locally

```bash
# Clone the repo
git clone https://github.com/your-username/wall-calendar.git
cd wall-calendar

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📦 Build & Deploy

### Build for production
```bash
npm run build
npm run start
```

### Deploy to Vercel (recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) for automatic deployments on push.

---

## 🎬 Video Demo

A screen recording demonstrating:
- Calendar navigation with flip animation
- Date range selection (click + drag)
- Holiday markers
- Notes creation and persistence
- Dark mode toggle
- Responsive / mobile layout

*[Add your Loom/YouTube link here]*

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `←` `→` `↑` `↓` | Navigate between days |
| `Enter` | Select focused day |
| `Escape` | Clear selection |

---

## 📱 Mobile Support

- Touch-friendly day cells (min 36px tap targets)
- Swipe left → next month
- Swipe right → previous month
- Stacked layout: hero → calendar → notes

---

## 📄 License

MIT
