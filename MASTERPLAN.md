# IranianChessSchool — Master Plan

> **Vision:** A modern, all-in-one chess training, learning, and social media platform — more advanced than Russian Chess School. Built with Next.js 14, NextAuth, shadcn/ui, TailwindCSS, and deployed on Vercel.
>
> **Repository:** [https://github.com/mehrabix/IranianChessSchool.git](https://github.com/mehrabix/IranianChessSchool.git)

> **Hard Rule:** Every feature/component MUST have unit + integration + E2E tests before moving to the next task. No exceptions. "Tested" means all three layers pass.

---

## Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [Architecture Overview](#2-architecture-overview)
3. [Project Structure](#3-project-structure)
4. [Phase 1 — Foundation & Authentication](#4-phase-1--foundation--authentication)
5. [Phase 2 — Public Pages (Russian Chess School Clone)](#5-phase-2--public-pages-russian-chess-school-clone)
6. [Phase 3 — Learning Platform (Courses & Lessons)](#6-phase-3--learning-platform-courses--lessons)
7. [Phase 4 — Chess Engine & Analysis Tools](#7-phase-4--chess-engine--analysis-tools)
8. [Phase 5 — Social Features & Community](#8-phase-5--social-features--community)
9. [Phase 6 — Gamification & Progress Tracking](#9-phase-6--gamification--progress-tracking)
10. [Phase 7 — Payment & Subscriptions](#10-phase-7--payment--subscriptions)
11. [Phase 8 — Admin Dashboard](#11-phase-8--admin-dashboard)
12. [Phase 9 — Advanced AI & Engine Integration](#12-phase-9--advanced-ai--engine-integration)
13. [Phase 10 — Deployment & DevOps](#13-phase-10--deployment--devops)
14. [API Integrations Summary](#14-api-integrations-summary)
15. [Database Schema Overview](#15-database-schema-overview)
16. [Roadmap & Milestones](#16-roadmap--milestones)

---

## 0. Non-Negotiable Rule: Test Before Next

Every single feature, component, API route, or page MUST have tests at all three levels before you move on:

| Layer | Tool | What to Test |
|---|---|---|
| **Unit** | Vitest | Functions, hooks, utilities, chess logic, API client wrappers |
| **Integration** | Vitest + MSW | API routes, database queries, auth flows, Stripe webhooks |
| **E2E** | Playwright | User flows: signup → browse → purchase → learn → play → social |

**Workflow:**
```
Write code → Write unit tests → Write integration tests → Write E2E tests → All green → Next task
```

**Test files live next to their source:**
```
src/lib/chess/engine.ts          → src/lib/chess/engine.test.ts
src/app/api/chess/analyze/route.ts → src/app/api/chess/analyze/route.test.ts
src/components/chess/ChessBoard.tsx → src/components/chess/ChessBoard.test.tsx
e2e/landing.spec.ts              # Playwright E2E
e2e/auth.spec.ts
e2e/courses.spec.ts
```

**CI gate:** GitHub Actions runs `vitest` (unit+integration) and `playwright` (E2E) on every PR. Red = blocked.

| Layer | Technology |
|---|---|
| **Package Manager** | pnpm (fast, disk-efficient, strict) |
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript (strict mode) |
| **Styling** | TailwindCSS + shadcn/ui components |
| **Auth** | NextAuth.js v5 (Auth.js) with credentials + OAuth (Google, GitHub) |
| **Database** | Turso (SQLite edge database, libSQL) |
| **ORM** | Drizzle ORM |
| **File Storage** | Uploadthing / Cloudinary (images, PGNs, videos) |
| **Payments** | Stripe (subscriptions) |
| **State Management** | Zustand (client state) + React Query (server state) |
| **Forms** | React Hook Form + Zod |
| **Chess Engine** | Stockfish 16 (via WebAssembly) |
| **Chess APIs** | Chess.com API, Lichess API, Lichess Open Database |
| **Real-time** | Socket.io / WebSockets (live games, chat) |
| **Email** | Resend / Nodemailer |
| **Analytics** | PostHog (self-hosted or cloud) |
| **Deployment** | Vercel + Turso (SQLite edge) + Cloudinary (media) |
| **Testing** | Vitest + Playwright |
| **CI/CD** | GitHub Actions |

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Vercel (Edge + Serverless)              │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              Next.js 14 App Router                   │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────────┐     │ │
│  │  │  Public  │ │  Auth    │ │  Dashboard (App) │     │ │
│  │  │  Pages   │ │  Pages   │ │  (Student/Admin) │     │ │
│  │  └──────────┘ └──────────┘ └──────────────────┘     │ │
│  │  ┌──────────────────────────────────────────────┐   │ │
│  │  │         API Routes (Next.js)                  │   │ │
│  │  │  /api/auth  /api/chess  /api/courses          │   │ │
│  │  │  /api/payments  /api/social  /api/analysis    │   │ │
│  │  └──────────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              External Services                       │ │
│  │  Chess.com API ─ Lichess API ─ Stockfish WASM       │ │
│  │  Stripe ─ Turso (SQLite Edge) ─ Cloudinary           │ │
│  │  Resend ─ PostHog ─ Upstash Redis                   │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Client (Browser)                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐  │
│  │ Next.js  │ │ shadcn   │ │ Tailwind │ │ Stockfish WASM │  │
│  │ App      │ │ UI       │ │ CSS      │ │ (in-browser)  │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                  Next.js API Routes (Serverless)              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │ Auth     │ │ Chess    │ │ Courses  │ │ Social/Feed  │   │
│  │ NextAuth │ │ Proxy    │ │ CRUD     │ │ API          │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    External Services                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │ Chess.com│ │ Lichess  │ │ Stripe   │ │ Stockfish    │   │
│  │ API      │ │ API      │ │          │ │ (WASM/Cloud) │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│  │  Turso    │ │ Cloudin- │ │ Upstash  │                    │
│  │ Postgres │ │ ary      │ │ Redis    │                    │
│  └──────────┘ └──────────┘ └──────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Project Structure

```
IranianChessSchool/
├── .github/workflows/          # CI/CD
├── drizzle/
│   ├── schema.ts               # Drizzle schema definitions
│   ├── migrations/              # Generated SQL migrations
│   ├── seed.ts                 # Seed data
│   └── config.ts               # Turso connection config
├── public/
│   ├── images/
│   ├── fonts/
│   └── pgns/                   # Sample PGN files
├── src/
│   ├── app/
│   │   ├── (public)/            # Public-facing pages
│   │   │   ├── page.tsx         # Home (landing)
│   │   │   ├── about/page.tsx
│   │   │   ├── faq/page.tsx
│   │   │   ├── blog/
│   │   │   ├── contact/page.tsx
│   │   │   ├── kids/page.tsx
│   │   │   └── pricing/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── dashboard/courses/
│   │   │   ├── dashboard/lessons/
│   │   │   ├── dashboard/analysis/
│   │   │   ├── dashboard/puzzles/
│   │   │   ├── dashboard/games/
│   │   │   ├── dashboard/community/
│   │   │   ├── dashboard/progress/
│   │   │   └── dashboard/settings/
│   │   ├── (admin)/
│   │   │   └── admin/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/
│   │   │   ├── chess/
│   │   │   │   ├── analyze/route.ts
│   │   │   │   ├── puzzles/route.ts
│   │   │   │   ├── import/route.ts
│   │   │   │   └── engine/route.ts
│   │   │   ├── courses/
│   │   │   ├── payments/
│   │   │   ├── social/
│   │   │   └── upload/route.ts
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                  # shadcn components
│   │   ├── chess/               # Chess-specific components
│   │   │   ├── ChessBoard.tsx
│   │   │   ├── ChessClock.tsx
│   │   │   ├── MoveList.tsx
│   │   │   ├── AnalysisBoard.tsx
│   │   │   ├── PuzzleViewer.tsx
│   │   │   └── EngineEval.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── DashboardLayout.tsx
│   │   ├── landing/             # Landing page sections
│   │   └── shared/
│   ├── lib/
│   │   ├── auth.ts              # NextAuth config
│   │   ├── db.ts                # Drizzle + Turso client
│   │   ├── chess/
│   │   │   ├── engine.ts        # Stockfish wrapper
│   │   │   ├── pgn.ts           # PGN parser/generator
│   │   │   ├── fen.ts           # FEN utilities
│   │   │   ├── chesscom.ts      # Chess.com API client
│   │   │   └── lichess.ts       # Lichess API client
│   │   ├── stripe.ts
│   │   ├── upload.ts
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useChessBoard.ts
│   │   ├── useEngine.ts
│   │   ├── usePuzzle.ts
│   │   └── useSocial.ts
│   ├── store/                   # Zustand stores
│   │   ├── chessStore.ts
│   │   └── uiStore.ts
│   ├── types/
│   │   ├── chess.ts
│   │   ├── course.ts
│   │   └── user.ts
│   └── styles/
├── public/
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── components.json              # shadcn config
└── package.json
```

---

## 4. Phase 1 — Foundation & Authentication

### 4.1 Project Initialization

```bash
pnpm create next-app@latest iranian-chess-school --typescript --tailwind --eslint --app --src-dir
cd iranian-chess-school
pnpm add -D shadcn@latest
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button card input form dialog dropdown-menu avatar badge sheet tabs separator accordion toast
```

### 4.2 Database (Drizzle ORM + Turso)

**Setup:**
```bash
pnpm add drizzle-orm @libsql/client
pnpm add -D drizzle-kit
pnpm dlx drizzle-kit generate
pnpm dlx drizzle-kit push
```

**Key Tables (defined in `drizzle/schema.ts`):** `users`, `accounts`, `sessions`, `courses`, `modules`, `lessons`, `puzzles`, `puzzleAttempts`, `games`, `posts`, `comments`, `likes`, `subscriptions`, `payments`, `progress`, `achievements`, `tournaments`, `coaches`, `bookings`

**Turso benefits:** Edge-deployed SQLite, zero cold starts, works with Vercel Edge Functions, built-in replication, HTTP API for serverless.

### 4.3 Database Client (`src/lib/db.ts`)

```typescript
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client);
export { eq, and, or, desc, asc, sql, like, inArray, between } from 'drizzle-orm';
```

### 4.4 Drizzle Migrations Workflow

```bash
# Generate migration from schema changes
pnpm dlx drizzle-kit generate

# Apply migrations to Turso
pnpm dlx drizzle-kit push

# Open Drizzle Studio (GUI for DB)
pnpm dlx drizzle-kit studio

# Generate seed data
pnpm tsx drizzle/seed.ts
```

### 4.5 Authentication (NextAuth v5)

- **Providers:** Credentials (email/password), Google OAuth, GitHub OAuth
- **Features:** Email verification, password reset, 2FA (optional), role-based access (student, coach, admin)
- **Session strategy:** JWT (stateless, edge-compatible)

---

## 5. Phase 2 — Public Pages (Russian Chess School Clone)

### 5.1 Home Page (`/`)

| Section | Description |
|---|---|
| **Hero** | Full-width hero with animated chess board, tagline: "Iranian Chess School — Master the Game, Think Deeper" |
| **Stats Bar** | Students count, hours of content, rating improvements (like RCS) |
| **Features Grid** | Structured lessons, game reviews, 1-on-1 coaching, tournaments, leaderboard, community |
| **What's Inside** | Training levels (Beginner 0–500 → Club Player 1600–2000) |
| **Who It's For** | 3 cards: stuck at rating, no direction, need community |
| **Pricing** | 3 tiers: Standard ($29), Premium ($49), VIP ($199) |
| **Testimonials** | Student success stories with rating gains |
| **CTA** | "Try for Free" → signup flow |
| **Footer** | Links, social icons, newsletter signup |

### 5.2 Kids Page (`/kids`)

- Hero with kid-friendly design
- Program features (group classes, game reviews, 1-on-1)
- Pricing: Standard ($79/mo), Premium ($249/mo)
- CTA → signup

### 5.3 About Page (`/about`)

- Mission statement
- Coach profiles (with FIDE links, photos, bios)
- Teaching methodology section

### 5.4 FAQ Page (`/faq`)

- Accordion-style Q&A
- Topics: online/offline, pricing, coaches, time commitment, refunds

### 5.5 Blog (`/blog`)

- Blog post cards with images, author, date, read time
- Individual post pages with rich content
- Categories/tags

### 5.6 Contact Page (`/contact`)

- Contact form (name, email, subject, message)
- WhatsApp link, email link
- Social media links

### 5.7 Pricing Page (`/pricing`)

- 3-tier pricing cards (Standard, Premium, VIP)
- Feature comparison table
- CTA → checkout

---

## 6. Phase 3 — Learning Platform (Courses & Lessons)

### 6.1 Course System

- **Levels:** Beginner (0–500), Improver (500–800), Intermediate (800–1200), Advanced (1200–1600), Club (1600–2000)
- **Content types:** Video lessons, text lessons, interactive puzzles, downloadable PGNs, quizzes
- **Progress tracking:** % complete per course, per module
- **Homework system:** Coaches assign homework, students submit PGNs, coaches review

### 6.2 Lesson Player

- Video player (Mux/Cloudinary) with transcript
- Embedded interactive chess board (react-chessboard + chess.js)
- Move-by-move annotation synced with video
- "Try it yourself" mode — pause video, make moves on board
- Quiz at end of each lesson

### 6.3 Curriculum Structure

```
Level (e.g., Beginner 0–500)
├── Module 1: Piece Movement & Basic Rules
│   ├── Lesson 1: The Board & Pieces (video + interactive)
│   ├── Lesson 2: How Pieces Move (interactive board)
│   ├── Quiz: Piece Movement
│   └── Homework: PGN exercises
├── Module 2: Basic Tactics
│   ├── Lesson 3: Forks
│   ├── Lesson 4: Pins
│   └── ...
└── Module N: ...
```

---

## 6. Phase 4 — Chess Engine & Analysis Tools

### 6.1 In-Browser Analysis Board

- **Library:** `chess.js` + `react-chessboard` + Stockfish WASM
- **Features:**
  - Drag-and-drop piece movement
  - Move history with navigation (forward/back)
  - Stockfish evaluation bar
  - Best move suggestions
  - Opening book lookup (via Lichess opening API)
  - Export/import PGN
  - Board orientation flip
  - Annotations (arrows, squares, text)

### 6.2 Game Analysis

- Import games from Chess.com / Lichess (by username)
- Upload PGN files
- Stockfish analysis with move-by-move evaluation
- Blunder detection
- Accuracy % per game
- Opening classification (via Lichess opening API)
- Export analysis report as PDF

### 6.3 Puzzle System

- **Sources:** Lichess puzzle database (millions of puzzles), custom coach-created puzzles
- **Features:**
  - Rating-based puzzle matching
  - Streak mode
  - Puzzle themes (fork, pin, sacrifice, etc.)
  - Daily puzzle
  - Puzzle rush (timed)
  - Performance graph

### 6.4 Interactive Board

- Powered by `chess.js` + `react-chessboard`
- Features:
  - Drag-and-drop
  - Move validation
  - Highlight last move
  - Show legal moves
  - Board editor (set up positions)
  - FEN/EPD import/export
  - Arrow & square drawing (for coaching)

---

## 7. Phase 4 — Chess Engine & Analysis Tools

### 7.1 Stockfish Integration

- **In-browser:** Stockfish 16 compiled to WebAssembly via `stockfish.wasm`
- **Cloud fallback:** Server-side Stockfish for mobile/low-power devices
- **Features:**
  - Multi-variation analysis (top 3 lines)
  - Depth control (up to 30+)
  - Infinite analysis mode
  - Position evaluation graph
  - Blunder check after game
  - Accuracy % calculation

### 7.2 Chess.com API Integration

- Fetch user profile, stats, recent games
- Import games by username
- Display rating graphs (blitz, rapid, bullet)
- Sync puzzles

### 7.3 Lichess API Integration

- Fetch user profile, stats, games
- Import games by username or URL
- Lichess puzzle database (open dataset)
- Lichess opening explorer
- Lichess tablebase (endgame)

### 7.4 Opening Explorer

- Built-in opening book (via Lichess open database)
- Win/draw/loss statistics by position
- Master games explorer
- Filter by rating, year, player

---

## 8. Phase 5 — Social Features & Community

### 8.1 Social Feed

- **Posts:** Text, images, PGNs, game links
- **Interactions:** Like, comment, share, bookmark
- **Feed types:** Global feed, following feed, trending
- **Rich embeds:** Chess.com/lichess game links auto-embed with board preview

### 8.2 User Profiles

- Avatar, bio, chess rating (Chess.com + Lichess linked)
- Activity feed (recent games, posts, achievements)
- Stats dashboard (puzzles solved, lessons completed, rating history)
- Followers / following

### 8.3 Community Features

- **Groups:** By level (Beginner, Intermediate, Advanced), by topic (Openings, Endgames)
- **Forums:** Discussion threads per course/module
- **Direct Messaging:** Real-time chat (Socket.io)
- **Live Events:** Scheduled group classes, blitz tournaments, webinars
- **Leaderboard:** Weekly/monthly rankings by puzzle score, games played, rating improvement

### 8.4 Coaching System

- Coach profiles with availability calendar
- 1-on-1 booking system (integrated with Stripe)
- Live coaching sessions (video via Daily.co / Whereby)
- Session recording & PGN sharing
- Student progress reports for coaches

---

## 8. Phase 6 — Gamification & Progress Tracking

### 8.1 XP & Level System

- Earn XP for: completing lessons, solving puzzles, playing games, daily login, streaks
- Levels: Bronze → Silver → Gold → Diamond → Master → Grandmaster
- Level-up animations and badges

### 8.2 Achievements

- "First Puzzle Solved", "10-Day Streak", "Century Club" (100 puzzles in a day)
- "Opening Expert" (complete all opening modules)
- "Tactician" (1000 puzzles solved)
- Badges displayed on profile

### 8.3 Leaderboards

- Weekly puzzle leaderboard
- Monthly rating improvement leaderboard
- Course completion leaderboard
- Streak leaderboard

### 8.4 Progress Dashboard

- Rating graph (imported from Chess.com/Lichess)
- Puzzle rating progression
- Course completion % per level
- Time spent learning (daily/weekly/monthly)
- Weakness analysis (which tactical themes need work)

---

## 9. Phase 7 — Payment & Subscriptions

### 9.1 Stripe Integration

- **Products:** Standard ($29/mo), Premium ($49/mo), VIP ($199/mo)
- **Kids plans:** Standard ($79/mo), Premium ($249/mo)
- **Features:**
  - Monthly & annual billing
  - 7-day free trial
  - Stripe Customer Portal (manage subscription, cancel, upgrade/downgrade)
  - Webhook handling (subscription events, payment failures)
  - Coupon/discount system

### 9.2 Pricing Page

- 3-tier cards with feature comparison
- Toggle monthly/yearly
- "Try for free" CTA
- FAQ below pricing

---

## 8. Phase 6 — Gamification & Progress Tracking

### 8.1 XP & Level System

| Action | XP |
|---|---|
| Complete a lesson | 50 XP |
| Solve a puzzle | 10 XP |
| Puzzle streak (per day) | 5 XP bonus |
| Daily login | 5 XP |
| Complete a module | 200 XP |
| Complete a course | 1000 XP |
| Play a rated game | 20 XP |
| Post in community | 15 XP |
| Comment | 5 XP |

### 8.2 Levels

| Level | Title | XP Required |
|---|---|---|
| 1–5 | Bronze | 0–500 |
| 6–10 | Silver | 500–2000 |
| 11–15 | Gold | 2000–5000 |
| 16–20 | Platinum | 5000–10000 |
| 21–25 | Diamond | 10000–20000 |
| 26–30 | Master | 20000–40000 |
| 31–35 | Grandmaster | 40000+ |

### 8.3 Achievements

- 40+ achievements across categories: Puzzles, Lessons, Social, Streaks, Games
- Badge display on profile
- Shareable achievement cards

### 8.4 Progress Dashboard

- Rating graph (Chess.com + Lichess combined)
- Puzzle rating progression
- Course completion pie chart
- Weekly activity heatmap
- Weakness radar chart (tactics, strategy, endgame, openings)

---

## 9. Phase 7 — Payment & Subscriptions

### 9.1 Stripe Integration

- **Products:** Standard ($29/mo), Premium ($49/mo), VIP ($199/mo)
- **Kids plans:** Standard ($79/mo), Premium ($249/mo)
- **Features:**
  - Monthly & annual billing (annual = 2 months free)
  - 7-day free trial (Stripe `trial_period_days`)
  - Stripe Customer Portal for self-serve management
  - Webhooks: `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated`
  - Dunning emails on failed payments

### 9.2 Feature Gating

| Feature | Free | Standard | Premium | VIP |
|---|---|---|---|---|
| Basic lessons (Level 1) | ✅ | ✅ | ✅ | ✅ |
| All courses | ❌ | ✅ | ✅ | ✅ |
| Puzzle access | Limited | ✅ | ✅ | ✅ |
| Community access | Read-only | ✅ | ✅ | ✅ |
| Game analysis | ❌ | Basic | Advanced | Advanced |
| 1-on-1 coaching | ❌ | ❌ | Monthly | Weekly (4x/mo) |
| Group classes | ❌ | ❌ | ✅ | ✅ |
| Game reviews | ❌ | ❌ | With Dina | With Dina |
| Live blitz events | ❌ | With Alexandra | With Dina | With Dina |

---

## 10. Phase 8 — Admin Dashboard

### 10.1 Admin Features

- **User management:** View, ban, assign roles
- **Content management:** Create/edit courses, lessons, modules
- **Puzzle management:** Upload, tag, approve custom puzzles
- **Payment management:** View subscriptions, refunds, invoices
- **Analytics:** DAU/MAU, conversion rates, revenue, popular content
- **Coach management:** Approve coaches, set availability, view sessions
- **Blog management:** Create/edit/delete posts
- **Moderation:** Reported posts, comments, users

---

## 11. Phase 9 — Advanced AI & Engine Integration

### 11.1 Stockfish WebAssembly

- **Library:** `stockfish.wasm` (compiled from Stockfish 16)
- **Usage:**
  - In-browser analysis (no server cost)
  - Position evaluation
  - Best move calculation
  - Blunder detection
  - Game annotation
- **Fallback:** Server-side Stockfish via API route for mobile

### 11.2 Chess.com API

- **Endpoints used:**
  - `GET /pub/player/{username}` — profile
  - `GET /pub/player/{username}/stats` — stats
  - `GET /pub/player/{username}/games/{year}/{month}` — games
  - `GET /pub/player/{username}/puzzles` — puzzle stats
- **Features:**
  - Import games by username
  - Sync rating history
  - Display stats on profile

### 11.3 Lichess API

- **Endpoints used:**
  - `GET /api/user/{username}` — profile
  - `GET /api/user/{username}/rating-history` — rating graph
  - `GET /api/games/user/{username}` — games
  - `GET /api/puzzle/daily` — daily puzzle
  - `GET /api/opening` — opening explorer
  - `GET /api/tablebase` — endgame tablebase
- **Features:**
  - Import games
  - Opening explorer
  - Daily puzzle
  - Endgame tablebase lookup

### 11.4 AI Coach (OpenAI / Claude API)

- Natural language chess coaching
- "Explain this position like I'm a beginner"
- "What's the plan here?"
- "Why is this move a blunder?"
- Position analysis in plain English

---

## 12. Phase 8 — Admin Dashboard

### 12.1 Admin Features

| Feature | Description |
|---|---|
| User Management | View, search, ban, assign roles |
| Content CMS | Create/edit courses, modules, lessons (rich text + video) |
| Puzzle Manager | Upload, tag, approve, delete puzzles |
| Payment Dashboard | Revenue, subscriptions, refunds, invoices |
| Analytics | DAU/MAU, conversion, retention, popular content |
| Coach Management | Approve, schedule, view session history |
| Blog Editor | Rich text editor for blog posts |
| Moderation | Flagged posts, comments, users |
| Email Campaigns | Send newsletters, announcements |

---

## 12. Phase 9 — Advanced AI & Engine Integration

### 12.1 Stockfish WASM (In-Browser)

```typescript
// lib/chess/engine.ts
import { Stockfish } from 'stockfish.wasm';

export class ChessEngine {
  private engine: Stockfish;

  async init(): Promise<void> { /* load WASM */ }
  evaluate(fen: string, depth: number): Promise<EvaluationResult>
  getBestMove(fen: string, depth: number): Promise<string>
  getTopLines(fen: string, depth: number, lines: number): Promise<Line[]>
  analyzeGame(pgn: string): Promise<GameAnalysis>
  findBlunders(pgn: string): Promise<Blunder[]>
}
```

### 12.2 Chess.com API Client

```typescript
// lib/chess/chesscom.ts
export class ChessComClient {
  async getProfile(username: string): Promise<ChessComProfile>
  async getStats(username: string): Promise<ChessComStats>
  async getGames(username: string, year: number, month: number): Promise<ChessComGame[]>
  async importGames(username: string): Promise<ImportedGame[]>
}
```

### 12.3 Lichess API Client

```typescript
// lib/chess/lichess.ts
export class LichessClient {
  async getProfile(username: string): Promise<LichessUser>
  async getRatingHistory(username: string): Promise<RatingPoint[]>
  async getGames(username: string, options?: GameOptions): Promise<LichessGame[]>
  async getDailyPuzzle(): Promise<Puzzle>
  async getOpeningExplorer(fen: string): Promise<OpeningStats>
  async getTablebase(fen: string): Promise<TablebaseResult>
}
```

### 12.4 AI Coach (OpenAI)

```typescript
// lib/chess/aiCoach.ts
export class AICoach {
  async explainPosition(fen: string, level: string): Promise<string>
  async analyzeGame(pgn: string, studentLevel: string): Promise<CoachingReport>
  async answerQuestion(question: string, context: string): Promise<string>
  async generatePuzzle(theme: string, rating: number): Promise<Puzzle>
}
```

---

## 12. Phase 9 — Advanced AI & Engine Integration

### 12.1 Stockfish WASM (In-Browser)

```typescript
// lib/chess/engine.ts
import { Stockfish } from 'stockfish.wasm';

export class ChessEngine {
  private engine: Stockfish;

  async init(): Promise<void> {
    this.engine = await Stockfish();
  }

  async evaluate(fen: string, depth: number = 20): Promise<EvaluationResult> {
    // Returns { score, bestMove, pv }
  }

  async getTopLines(fen: string, depth: number, lines: number): Promise<Line[]> {
    // Returns top N variations
  }

  async analyzeGame(pgn: string): Promise<GameAnalysis> {
    // Returns move-by-move evaluation, blunders, accuracy %
  }
}
```

### 12.2 Chess.com API Client

```typescript
// lib/chess/chesscom.ts
const BASE = 'https://api.chess.com/pub';

export async function getChessComProfile(username: string) {
  const res = await fetch(`${BASE}/player/${username}`);
  return res.json();
}

export async function getChessComGames(username: string, year: number, month: number) {
  const res = await fetch(`${BASE}/player/${username}/games/${year}/${month}`);
  return res.json();
}
```

### 12.3 Lichess API Client

```typescript
// lib/chess/lichess.ts
const BASE = 'https://lichess.org/api';

export async function getLichessProfile(username: string) {
  const res = await fetch(`${BASE}/user/${username}`);
  return res.json();
}

export async function getLichessPuzzles(theme?: string, count = 10) {
  const res = await fetch(`${BASE}/puzzle?${new URLSearchParams({ count: String(count), ...(theme && { theme }) })}`);
  return res.json();
}
```

### 12.4 AI Coach (Free-Tier AI Providers)

No need to pay for OpenAI. Use any of these **free-tier** AI providers with the same OpenAI-compatible SDK. Set one env var and the router handles failover automatically.

| Provider | Env Var | Free Tier |
|---|---|---|
| **OpenRouter** | `OPENROUTER_API_KEY` | Free credits on signup |
| **Groq** | `GROQ_API_KEY` | Free tier — 30 req/min on Llama 3 |
| **Cerebras** | `CEREBRAS_API_KEY` | Free tier available |
| **Google Gemini** | `GEMINI_API_KEY` | Free 60 req/min |
| **Mistral** | `MISTRAL_API_KEY` | Free tier available |
| **GitHub Models** | `GITHUB_API_KEY` | Free with GitHub account |
| **Cloudflare** | `CLOUDFLARE_API_KEY` | Free Workers AI |
| **NVIDIA NIM** | `NVIDIA_API_KEY` | Free tier available |
| **HuggingFace** | `HF_API_KEY` | Free inference API |
| **SambaNova** | `SAMBANOVA_API_KEY` | Free tier available |
| **DeepSeek** | `DEEPSEEK_API_KEY` | Free tier available |
| **Cohere** | `COHERE_API_KEY` | Free trial API key |

**Strategy:** Set multiple env vars. The AI router tries them in priority order with auto-failover. If one provider is down or rate-limited, it falls through to the next. All providers above offer free tiers — zero cost for development and launch.

```typescript
// lib/chess/aiCoach.ts
// Works with ANY provider above — just set the env var
const BASE_URL = process.env.AI_BASE_URL || 'https://openrouter.ai/api/v1';
const API_KEY = process.env.AI_API_KEY || process.env.OPENROUTER_API_KEY;

export async function explainPosition(fen: string, level: string) {
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini', // or any model the provider supports
      messages: [{
        role: 'user',
        content: `Explain this chess position (FEN: ${fen}) to a ${level} player. Focus on key plans, threats, and the best move.`
      }],
    }),
  });
  return res.json();
}
```

### 12.5 Free-Tier AI Provider Router

Instead of hardcoding OpenAI, use a **multi-provider router** that tries providers in priority order with auto-failover. Set any combination of these env vars:

| Provider | Env Var | Base URL | Free Tier |
|---|---|---|---|
| **OpenRouter** | `OPENROUTER_API_KEY` | `openrouter.ai/api/v1` | Free credits on signup |
| **Groq** | `GROQ_API_KEY` | `api.groq.com/openai/v1` | 30 req/min free (Llama 3) |
| **Cerebras** | `CEREBRAS_API_KEY` | `api.cerebras.ai/v1` | Free tier available |
| **Google Gemini** | `GEMINI_API_KEY` | `generativelanguage.googleapis.com/v1beta/openai` | 60 req/min free |
| **Mistral** | `MISTRAL_API_KEY` | `api.mistral.ai/v1` | Free tier available |
| **GitHub Models** | `GITHUB_API_KEY` | `models.github.ai/inference` | Free with GitHub account |
| **Cloudflare** | `CLOUDFLARE_API_KEY` | `api.cloudflare.com/client/v4/.../ai/v1` | Free Workers AI |
| **NVIDIA NIM** | `NVIDIA_API_KEY` | `integrate.api.nvidia.com/v1` | Free tier available |
| **HuggingFace** | `HF_API_KEY` | `router.huggingface.co/v1` | Free inference API |
| **SambaNova** | `SAMBANOVA_API_KEY` | `api.sambanova.ai/v1` | Free tier available |
| **DeepSeek** | `DEEPSEEK_API_KEY` | `api.deepseek.com` | Free tier available |
| **Cohere** | `COHERE_API_KEY` | `api.cohere.com/v1` | Free trial API key |

**Strategy:** Set any combination of these env vars. The AI router tries them in priority order with auto-failover. If one provider is down or rate-limited, it falls through to the next. All providers above offer free tiers — zero cost for development and launch.

```typescript
// lib/chess/aiCoach.ts
// Works with ANY provider above — just set the env var
const BASE_URL = process.env.AI_BASE_URL || 'https://openrouter.ai/api/v1';
const API_KEY = process.env.AI_API_KEY || process.env.OPENROUTER_API_KEY;

export async function explainPosition(fen: string, level: string) {
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini', // or llama-3, gemini-pro, etc.
      messages: [{
        role: 'user',
        content: `Explain this chess position (FEN: ${fen}) to a ${level} level player. Focus on key plans, threats, and the best move.`
      }],
    }),
  });
  return res.json();
}
```

---

## 13. API Layer — Next.js Route Handlers

All backend logic lives in Next.js API Route Handlers (`src/app/api/`). No separate backend server needed.

### API Route Structure

```
src/app/api/
├── auth/
│   └── [...nextauth]/route.ts       # NextAuth (Auth.js)
├── chess/
│   ├── analyze/route.ts             # POST — Stockfish analysis
│   ├── puzzles/
│   │   ├── route.ts                 # GET — list puzzles
│   │   ├── daily/route.ts           # GET — daily puzzle
│   │   └── [id]/route.ts           # GET — single puzzle
│   ├── import/
│   │   ├── chesscom/route.ts       # POST — import from Chess.com
│   │   └── lichess/route.ts        # POST — import from Lichess
│   ├── engine/route.ts             # POST — evaluate position
│   └── opening/route.ts            # GET — opening explorer
├── courses/
│   ├── route.ts                    # GET — list, POST — create
│   ├── [id]/route.ts               # GET/PUT/DELETE
│   └── [id]/lessons/route.ts       # GET — lessons in course
├── puzzles/
│   ├── route.ts                    # GET — list, POST — attempt
│   ├── daily/route.ts              # GET — daily puzzle
│   └── [id]/route.ts               # GET — single puzzle
├── social/
│   ├── posts/route.ts              # GET/POST posts
│   ├── posts/[id]/route.ts
│   ├── posts/[id]/like/route.ts
│   └── posts/[id]/comments/route.ts
├── payments/
│   ├── checkout/route.ts           # POST — create Stripe checkout
│   ├── portal/route.ts             # POST — Customer Portal
│   └── webhook/route.ts            # POST — Stripe webhooks
├── progress/
│   ├── route.ts                    # GET/POST user progress
│   └── leaderboard/route.ts        # GET — leaderboard
├── users/
│   ├── route.ts                    # GET/PUT profile
│   ├── [id]/route.ts               # GET — public profile
│   └── [id]/follow/route.ts        # POST — follow/unfollow
├── upload/route.ts                 # POST — file upload
└── cron/
    ├── daily-puzzle/route.ts       # CRON — fetch daily puzzle
    └── cleanup/route.ts             # CRON — cleanup stale data

| API | Purpose | Endpoints Used |
|---|---|---|
| **Chess.com** | User profiles, stats, game history | `/pub/player/{username}`, `/pub/player/{username}/stats`, `/pub/player/{username}/games/{year}/{month}` |
| **Lichess** | User data, puzzles, opening explorer, tablebase | `/api/user/{username}`, `/api/puzzle/daily`, `/api/opening`, `/api/tablebase`, `/api/games/user/{username}` |
| **Stockfish WASM** | In-browser engine analysis | N/A (local WASM) |
| **AI Providers** (OpenRouter/Groq/Gemini/etc.) | AI coach, position explanation | Chat Completions API (multi-provider router with free tiers) |
| **Stripe** | Subscriptions, payments | Checkout, Customer Portal, Webhooks |
| **Cloudinary** | Image/video upload | Upload API, transformations |
| **Resend** | Transactional emails | Email API |

---

## 15. Database Schema (Drizzle ORM + Turso)

### Schema Definition (`drizzle/schema.ts`)

```typescript
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').unique().notNull(),
  emailVerified: integer('email_verified', { mode: 'timestamp' }),
  image: text('image'),
  role: text('role', { enum: ['STUDENT', 'COACH', 'ADMIN'] }).default('STUDENT'),
  chessComUsername: text('chess_com_username'),
  lichessUsername: text('lichess_username'),
  rating: integer('rating').default(0),
  xp: integer('xp').default(0),
  level: integer('level').default(1),
  stripeCustomerId: text('stripe_customer_id'),
  subscriptionId: text('subscription_id'),
  subscriptionStatus: text('subscription_status'),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).defaultNow(),
});

export const courses = sqliteTable('courses', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  level: text('level', { enum: ['BEGINNER', 'IMPROVER', 'INTERMEDIATE', 'ADVANCED', 'CLUB'] }),
  image: text('image'),
  published: integer('published', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
});

export const modules = sqliteTable('modules', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  order: integer('order').notNull(),
  courseId: text('course_id').references(() => courses.id),
});

export const lessons = sqliteTable('lessons', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content'),
  videoUrl: text('video_url'),
  order: integer('order').notNull(),
  moduleId: text('module_id').references(() => modules.id),
  courseId: text('course_id').references(() => courses.id),
  type: text('type', { enum: ['VIDEO', 'TEXT', 'INTERACTIVE', 'QUIZ'] }),
  duration: integer('duration'), // minutes
});

export const puzzles = sqliteTable('puzzles', {
  id: text('id').primaryKey(),
  fen: text('fen').notNull(),
  solution: text('solution').notNull(), // JSON array of moves
  rating: integer('rating'),
  themes: text('themes'), // JSON array
  popularity: integer('popularity'),
  playedCount: integer('played_count').default(0),
  successRate: real('success_rate'),
  source: text('source', { enum: ['LICHESS', 'CUSTOM'] }),
});

export const progress = sqliteTable('progress', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  lessonId: text('lesson_id').references(() => lessons.id),
  completed: integer('completed', { mode: 'boolean' }).default(false),
  score: integer('score'),
  timeSpent: integer('time_spent'), // seconds
  attempts: integer('attempts').default(0),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
});

export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  stripeSubscriptionId: text('stripe_subscription_id'),
  plan: text('plan', { enum: ['STANDARD', 'PREMIUM', 'VIP'] }),
  status: text('status', { enum: ['ACTIVE', 'CANCELED', 'PAST_DUE'] }),
  currentPeriodStart: integer('current_period_start', { mode: 'timestamp' }),
  currentPeriodEnd: integer('current_period_end', { mode: 'timestamp' }),
  cancelAtPeriodEnd: integer('cancel_at_period_end', { mode: 'boolean' }).default(false),
});

export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  content: text('content'),
  image: text('image'),
  pgn: text('pgn'),
  likes: integer('likes').default(0),
  comments: integer('comments').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
});

export const achievements = sqliteTable('achievements', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  type: text('type'),
  title: text('title'),
  description: text('description'),
  icon: text('icon'),
  xpReward: integer('xp_reward'),
  unlockedAt: integer('unlocked_at', { mode: 'timestamp' }).defaultNow(),
});

export const bookings = sqliteTable('bookings', {
  id: text('id').primaryKey(),
  coachId: text('coach_id').references(() => users.id),
  studentId: text('student_id').references(() => users.id),
  startTime: integer('start_time', { mode: 'timestamp' }),
  endTime: integer('end_time', { mode: 'timestamp' }),
  status: text('status', { enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED'] }),
  meetingLink: text('meeting_link'),
  notes: text('notes'),
  price: integer('price'), // cents
});
```
```

---

## 16. Roadmap & Milestones

### Phase 1: Foundation (Week 1–2)
- [ ] Initialize Next.js project with TypeScript, Tailwind, shadcn
- [ ] Set up Drizzle ORM + Turso (libSQL)
- [ ] Implement NextAuth with credentials + OAuth
- [ ] Create base layout (Navbar, Footer, Sidebar)
- [ ] Set up Zustand stores
- [ ] **Tests:** Vitest config + first unit tests for auth + Playwright E2E for login flow
- [ ] Deploy to Vercel (preview)

### Phase 2: Public Pages (Week 3–4)
- [ ] Build Home page with all sections
- [ ] Build About page with coach profiles
- [ ] Build FAQ page with accordion
- [ ] Build Contact page with form
- [ ] Build Blog with CMS
- [ ] Build Kids page
- [ ] Build Pricing page
- [ ] Responsive design + i18n (Farsi/English)
- [ ] **Tests:** E2E for all public pages (Playwright), unit tests for components

### Phase 3: Learning Platform (Week 5–7)
- [ ] Course CRUD (admin)
- [ ] Lesson player with video + interactive board
- [ ] Module/lesson progress tracking
- [ ] Quiz system
- [ ] Homework submission & review
- [ ] Student dashboard
- [ ] **Tests:** Unit (chess logic, progress calc), Integration (course API), E2E (enroll → learn → quiz)

### Phase 4: Chess Engine & Analysis (Week 8–10)
- [ ] Stockfish WASM integration
- [ ] Analysis board with evaluation bar
- [ ] Game import (Chess.com + Lichess)
- [ ] PGN upload/export
- [ ] Blunder detection & accuracy %
- [ ] Opening explorer
- [ ] Puzzle system (Lichess dataset + custom)
- [ ] **Tests:** Unit (engine wrapper, PGN parser), Integration (import API), E2E (analyze a game)

### Phase 5: Social Features (Week 11–13)
- [ ] Social feed (posts, likes, comments)
- [ ] User profiles with stats
- [ ] Follow system
- [ ] Groups/communities
- [ ] Real-time chat (Socket.io)
- [ ] Leaderboards
- [ ] Notifications
- [ ] **Tests:** Unit (feed logic), Integration (post/comment API), E2E (create post → like → comment)

### Phase 6: Gamification (Week 14–15)
- [ ] XP & level system
- [ ] Achievements & badges
- [ ] Streak tracking
- [ ] Weekly challenges
- [ ] Progress dashboard with charts
- [ ] **Tests:** Unit (XP calc, level thresholds), Integration (progress API), E2E (earn XP → level up)

### Phase 7: Payments (Week 16–17)
- [ ] Stripe product setup
- [ ] Checkout flow (monthly/yearly)
- [ ] 7-day free trial
- [ ] Customer Portal
- [ ] Webhook handling
- [ ] Feature gating by plan
- [ ] **Tests:** Unit (feature gating logic), Integration (Stripe webhooks with MSW), E2E (purchase → access gated content)

### Phase 8: Admin Panel (Week 18–19)
- [ ] User management
- [ ] Content CMS
- [ ] Payment dashboard
- [ ] Analytics
- [ ] Moderation tools
- [ ] **Tests:** E2E (admin CRUD flows), Integration (admin API auth guards)

### Phase 9: Advanced Features (Week 20–22)
- [ ] AI Coach (multi-provider router — OpenRouter/Groq/Gemini free tiers)
- [ ] Live coaching booking system
- [ ] Tournament system (Swiss/Round-robin)
- [ ] Team/Club features
- [ ] Mobile responsiveness polish
- [ ] PWA support
- [ ] SEO optimization
- [ ] **Tests:** E2E (book coach → attend session), Integration (tournament pairing logic)

### Phase 10: Launch (Week 23–24)
- [ ] Performance optimization
- [ ] Load testing
- [ ] Security audit
- [ ] Production deployment
- [ ] Monitoring (Sentry, PostHog)
- [ ] Marketing site live

---

## Key Dependencies

```json
{
  "dependencies": {
    "next": "^14",
    "react": "^18",
    "react-dom": "^18",
    "next-auth": "^5",
    "drizzle-orm": "^0.30",
    "@libsql/client": "^0.6",
    "chess.js": "^1.0",
    "react-chessboard": "^1.0",
    "stockfish.wasm": "^1.0",
    "stripe": "^14",
    "zustand": "^4",
    "@tanstack/react-query": "^5",
    "react-hook-form": "^7",
    "zod": "^3",
    "react-hot-toast": "^2",
    "date-fns": "^3",
    "recharts": "^2",
    "socket.io-client": "^4",
    "uploadthing": "^6",
    "openai": "^4",
    "lucide-react": "^0.300"
  },
  "devDependencies": {
    "typescript": "^5",
    "tailwindcss": "^3",
    "drizzle-kit": "^0.22",
    "vitest": "^1",
    "playwright": "^1",
    "@types/node": "^20",
    "eslint": "^8",
    "prettier": "^3",
    "prettier-plugin-tailwindcss": "^0.5"
  }
}
```

---

## Environment Variables

```env
# Database (Turso)
TURSO_DATABASE_URL="libsql://..."
TURSO_AUTH_TOKEN="..."

# Auth
AUTH_SECRET="..."
AUTH_GITHUB_ID="..."
AUTH_GITHUB_SECRET="..."
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."

# Stripe
STRIPE_SECRET_KEY="..."
STRIPE_WEBHOOK_SECRET="..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="..."

# Upload
UPLOADTHING_SECRET="..."
UPLOADTHING_APP_ID="..."

# Email
RESEND_API_KEY="..."

# AI (free-tier providers — set any combination, router auto-failovers)
OPENROUTER_API_KEY="..."
GROQ_API_KEY="..."
GEMINI_API_KEY="..."
MISTRAL_API_KEY="..."
GITHUB_API_KEY="..."
CLOUDFLARE_API_KEY="..."
DEEPSEEK_API_KEY="..."
# ... set as many as you want, router tries them in order

# Analytics
NEXT_PUBLIC_POSTHOG_KEY="..."
NEXT_PUBLIC_POSTHOG_HOST="..."

# Chess APIs (no keys needed for public APIs)
NEXT_PUBLIC_CHESS_COM_API="https://api.chess.com/pub"
NEXT_PUBLIC_LICHESS_API="https://lichess.org/api"
```

---

## Deployment (Vercel Free Tier)

### Vercel Free Plan Limits

| Resource | Free Tier | Our Usage |
|---|---|---|
| **Bandwidth** | 100 GB/mo | ~5 GB/mo (est.) |
| **Serverless Functions** | 100 GB-hrs/mo | ~10 GB-hrs/mo |
| **Edge Functions** | 500k invocations/mo | ~50k/mo |
| **Build Minutes** | 6,000 min/mo | ~200 min/mo |
| **Team Members** | Unlimited | Solo |
| **Custom Domains** | 1 | `iranianchessschool.com` |
| **Cron Jobs** | 2 | Daily puzzle + cleanup |
| **Preview Deployments** | Unlimited | Auto on every PR |

**Verdict:** Free tier is more than enough for launch. Upgrade to Pro ($20/mo) only if bandwidth exceeds 100 GB.

### Vercel Configuration (`vercel.json`)

```json
{
  "framework": "nextjs",
  "regions": ["fra1"],
  "crons": [
    { "path": "/api/cron/daily-puzzle", "schedule": "0 0 * * *" },
    { "path": "/api/cron/cleanup-sessions", "schedule": "0 0 * * 0" }
  ],
  "git": {
    "deploymentEnabled": true
  }
}
```

### GitHub Actions CI/CD (Free)

        with: { node-version: 20 }
      - uses: pnpm/action-setup@v2
        with: { version: 8 }
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint

  test-unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - uses: pnpm/action-setup@v2
        with: { version: 8 }
      - run: pnpm install --frozen-lockfile
      - run: pnpm test:unit

  test-e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - uses: pnpm/action-setup@v2
        with: { version: 8 }
      - run: pnpm install --frozen-lockfile
      - run: pnpm playwright install --with-deps
      - run: pnpm test:e2e

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - uses: pnpm/action-setup@v2
        with: { version: 8 }
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
```

**Vercel + GitHub Integration (Free):**
- Connect GitHub repo to Vercel — auto-deploys on every push to `main`
- Preview deployments on every PR (unique URL per PR)
- No need for separate CI — Vercel runs build automatically
- GitHub Actions runs tests in parallel before Vercel build

**Free Tier Limits We Stay Within:**

| Service | Free Limit | Our Usage |
|---|---|---|
| GitHub Actions | 2000 min/mo | ~100 min/mo |
| Vercel Bandwidth | 100 GB/mo | ~5 GB/mo |
| Vercel Serverless | 100 GB-hrs/mo | ~10 GB-hrs/mo |
| Turso (free) | 500 MB DB, 1B rows read/mo | Well within |
| Turso replicas | 2 free replicas | 1 for dev, 1 for prod |
| Cloudinary | 25 GB storage, 25 GB bandwidth | Free tier enough |
| Stripe | No monthly fee, 2.9% + $0.30 per tx | Standard |

---

## AGENTS.md / Skills / MCP Configuration

### AGENTS.md

Create `AGENTS.md` at the project root. This file tells AI coding agents (like opencode, Cursor, Copilot) how to work with this project.

```markdown
# IranianChessSchool — AGENTS.md

## Project Overview
Next.js 14 chess training platform with Turso (SQLite edge) + Drizzle ORM.
Stack: Next.js App Router, NextAuth v5, shadcn/ui, TailwindCSS, Stockfish WASM.

## Commands
- `pnpm dev` — Start dev server
- `pnpm build` — Production build
- `pnpm lint` — ESLint
- `pnpm typecheck` — TypeScript check
- `pnpm test:unit` — Vitest unit tests
- `pnpm test:e2e` — Playwright E2E tests
- `pnpm test:all` — Unit + integration + E2E
- `pnpm db:generate` — Drizzle migration generate
- `pnpm db:push` — Push migrations to Turso
- `pnpm db:studio` — Open Drizzle Studio

## Architecture
- **Framework:** Next.js 14 App Router
- **Database:** Turso (SQLite edge) + Drizzle ORM
- **Auth:** NextAuth v5 (credentials + Google + GitHub)
- **UI:** shadcn/ui + TailwindCSS
- **Chess Engine:** Stockfish WASM (in-browser)
- **APIs:** Chess.com, Lichess, AI (OpenRouter/Groq/Gemini free tiers)
- **Payments:** Stripe
- **Deployment:** Vercel + GitHub Actions

## Project Structure
```
src/
├── app/
│   ├── (public)/        # Landing, about, faq, blog, contact, kids, pricing
│   ├── (dashboard)/     # Student dashboard (courses, analysis, puzzles, community)
│   ├── (admin)/          # Admin panel
│   └── api/              # All API route handlers
├── components/
│   ├── ui/               # shadcn components
│   ├── chess/            # Chess board, analysis, puzzle components
│   ├── layout/           # Navbar, Footer, Sidebar
│   └── landing/          # Landing page sections
├── lib/
│   ├── auth.ts           # NextAuth config
│   ├── db.ts             # Drizzle + Turso client
│   └── chess/            # Engine, PGN, FEN, API clients
├── hooks/
├── store/
└── types/
```

### Skills Directory (`.opencode/skills/`)

Create reusable skill files for the AI agent. Each skill is a markdown file with instructions for a specific task domain.

```
.opencode/
└── skills/
    ├── chess-engine.md       # Stockfish WASM integration patterns
    ├── database.md           # Drizzle schema patterns, Turso queries
    ├── auth.md               # NextAuth setup, role guards, session helpers
    ├── payments.md           # Stripe checkout, webhooks, feature gating
    ├── chess-api.md          # Chess.com + Lichess API client patterns
    ├── testing.md            # Vitest + Playwright conventions
    ├── deployment.md         # Vercel + GitHub Actions workflow
    └── social.md             # Feed, posts, comments, real-time chat
```

**Example — `.opencode/skills/chess-engine.md`:**
```markdown
# Chess Engine Skill

## Stockfish WASM
- Engine runs in-browser via `stockfish.wasm` — no server cost
- Fallback to `POST /api/chess/engine` for mobile

## Key Files
- `src/lib/chess/engine.ts` — Stockfish wrapper class
- `src/hooks/useEngine.ts` — React hook
- `src/components/chess/EngineEval.tsx` — Evaluation bar UI

## Testing
- Unit: test engine wrapper with mock positions
- Integration: test API route with MSW
- E2E: open analysis board → make moves → verify eval bar updates

## Common Pattern
```typescript
const { evaluate, isReady } = useEngine();
const result = await evaluate('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 20);
// { score: 0.2, bestMove: 'e2e4', pv: ['e2e4', 'e7e5', ...] }
```
```

### MCP (Model Context Protocol) — `.opencode/mcp.json`

MCP gives the AI agent direct access to project tools (GitHub, Vercel, Turso, Stripe).

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "${GITHUB_TOKEN}" }
    },
    "vercel": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-vercel"],
      "env": { "VERCEL_TOKEN": "${VERCEL_TOKEN}" }
    },
    "turso": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-turso"],
      "env": {
        "TURSO_DATABASE_URL": "${TURSO_DATABASE_URL}",
        "TURSO_AUTH_TOKEN": "${TURSO_AUTH_TOKEN}"
      }
    },
    "stripe": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-stripe"],
      "env": { "STRIPE_SECRET_KEY": "${STRIPE_SECRET_KEY}" }
    },
    "shadcn": {
      "command": "npx",
      "args": ["-y", "@shadcn/mcp"],
      "env": { "SHADCN_API_KEY": "${SHADCN_API_KEY}" }
    }
  }
}
```

**shadcn MCP** gives the AI agent direct access to add, update, and manage shadcn/ui components — no need to manually run `pnpm dlx shadcn add button`. The agent can discover available components, add them, and keep them updated automatically.

### Why This Matters

| File | Purpose |
|---|---|
| `AGENTS.md` | Tells AI agents the project structure, commands, and conventions at a glance |
| `.opencode/skills/*.md` | Domain-specific instructions so the AI knows exactly how to implement chess engine, auth, payments, etc. |
| `.opencode/mcp.json` | Gives the AI agent direct tool access to GitHub, Vercel, Turso, Stripe, shadcn |

Without these files, the AI agent wastes time guessing. With them, it works at full speed with zero context-switching.
This masterplan outlines a complete, production-ready chess platform that:

1. **Replicates** all features of Russian Chess School (landing, kids, about, FAQ, blog, pricing, contact)
2. **Exceeds it** with: in-browser Stockfish analysis, AI coach, social feed, gamification, puzzle system, opening explorer, live tournaments, and real-time community features
3. **Monetizes** via Stripe subscriptions with 3 tiers + free trial
4. **Integrates** Chess.com, Lichess, Stockfish, and free-tier AI providers (OpenRouter/Groq/Gemini/etc.)
5. **Deploys** on Vercel with Turso (edge SQLite), Cloudinary media, and full CI/CD

**Total estimated build time: 22–24 weeks (full-time team) or 3–4 months (solo with focus).**
