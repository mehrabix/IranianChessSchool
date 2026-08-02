# IranianChessSchool — Remaining Tasks

> Generated from full codebase audit against MASTERPLAN.md

---

## 🔴 Critical — i18n: 6 Locales Broken

**`fa`, `ru`, `it`, `de`, `fr`, `no`** are missing ~200 lines of nested translation objects that exist in `en.json`/`es.json`. Any call like `t('common.error.unauthorized')` crashes in these 6 locales.

### Missing nested sections (all 6 locales)
`common.error.*`, `common.validation.*`, `chess.undo`, `chess.engine.*`, `chess.error.*`, `achievements.title.*`, `achievements.desc.*`, `levels.bronze`–`levels.grandmaster`, `plans.standard`, `plans.premium`, `plans.vip`, `notifications.likedYourPost`, etc., `theme.toggleTheme`, `leaderboard.error.*`, `progress.validation.*`, `lessons.error.*`, `lessons.validation.*`, `comments.error.*`, `users.error.*`, `upload.error.*`, `payments.error.*`, `xp.error.*`, `ai.error.*`, `cron.error.*`, `posts.error.*`, `posts.validation.*`, `quizzes.error.*`, `footer.social.*`, `contact.validation.*`, `contact.success.*`, `auth.validation.*`, `groups.validation.*`, `tournaments.validation.*`, `tournaments.error.*`, `puzzles.validation.*`, `puzzles.error.*`, `admin.validation.*` (7 keys), `courses.error.*`

### Specific translation errors
- [ ] **fa.json**: `puzzles.streak` is Chinese `"连胜"` — should be Persian `"رکورد متوالی"`
- [ ] **ru.json**: `dashboard.importGames`/`importing`/`noGamesFound` still in English/Latin — should be Cyrillic
- [ ] **fr.json**: `trouvee` → `trouvée`, `Telecharger` → `Télécharger`
- [ ] **de.json**: `waehlen` → `wählen`

---

## 🟡 Phase 1 — Foundation Gaps

- [ ] Add `games` table to `drizzle/schema.ts`
- [ ] Add `payments` table to `drizzle/schema.ts`
- [ ] Build email verification flow (send + verify page)
- [ ] Build password reset flow (forgot + reset pages)
- [ ] Build `Sidebar.tsx` component
- [ ] Build `DashboardLayout.tsx` component
- [ ] Add lint job to `.github/workflows/ci.yml`

---

## 🟡 Phase 2 — Public Pages

- [ ] Home: Add "Who It's For" section (3 cards)
- [ ] Home: Add Pricing section on landing page
- [ ] Home: Add newsletter signup to Footer
- [ ] Blog: Add images to post cards
- [ ] Blog: Add author field to posts
- [ ] Blog: Add rich content to individual post pages
- [ ] Blog: Add category/tag filtering
- [ ] Pricing: Add monthly/yearly billing toggle
- [ ] Pricing: Add FAQ section below pricing
- [ ] FAQ: Replace `<details>` with shadcn `Accordion`
- [ ] Tests: Unit tests for all 8 public page components

---

## 🟡 Phase 3 — Learning Platform

- [ ] Build homework system (table + API + submission/review UI)
- [ ] Add interactive chess board to lesson player
- [ ] Tests: Unit tests for course/lesson page components (4 pages)

---

## 🟡 Phase 4 — Chess Engine

- [ ] Build visual evaluation bar component in `EngineEval.tsx`

---

## 🟡 Phase 5 — Social Features

- [ ] Build real-time chat (Socket.io server + client)

---

## 🟡 Phase 6 — Gamification

- [ ] Build weekly challenges system (table + API + UI)

---

## 🟡 Phase 7 — Payments

- [ ] Tests: Unit + integration tests for `checkout/route.ts`
- [ ] Tests: Unit + integration tests for `portal/route.ts`
- [ ] Tests: Unit + integration tests for `webhook/route.ts`

---

## 🟡 Phase 8 — Admin Dashboard

- [ ] Build admin user management (list, ban, role assignment)
- [ ] Build admin puzzle management (CRUD)
- [ ] Build admin payment dashboard (subscriptions, revenue, invoices)
- [ ] Build moderation tools (flagging system, moderation queue)
- [ ] Enhance analytics with charts/trends/time-series
- [ ] Add WYSIWYG editor to admin content forms

---

## 🟡 Phase 9 — Advanced Features

- [ ] Build coaching booking API routes
- [ ] Build PWA service worker
- [ ] Add `robots.txt`
- [ ] Add SEO meta/OG tags to all pages

---

## 🔴 Test Coverage Gaps

### Pages without tests (29 files)
- [ ] `[locale]/page.tsx` (landing)
- [ ] `[locale]/about/page.tsx`
- [ ] `[locale]/blog/page.tsx`
- [ ] `[locale]/blog/[slug]/page.tsx`
- [ ] `[locale]/contact/page.tsx`
- [ ] `[locale]/courses/page.tsx`
- [ ] `[locale]/courses/[id]/page.tsx`
- [ ] `[locale]/courses/[id]/lessons/[lessonId]/page.tsx`
- [ ] `[locale]/faq/page.tsx`
- [ ] `[locale]/kids/page.tsx`
- [ ] `[locale]/pricing/page.tsx`
- [ ] `[locale]/users/[id]/page.tsx`
- [ ] `[locale]/dashboard/page.tsx`
- [ ] `[locale]/dashboard/groups/page.tsx`
- [ ] `[locale]/dashboard/leaderboard/page.tsx`
- [ ] `[locale]/dashboard/tournaments/page.tsx`
- [ ] `[locale]/dashboard/puzzles/page.tsx`
- [ ] `(auth)/auth/signin/page.tsx`
- [ ] `(auth)/auth/register/page.tsx`
- [ ] `(auth)/auth/error/page.tsx`
- [ ] `admin/page.tsx`
- [ ] `admin/courses/page.tsx`
- [ ] `admin/courses/[id]/page.tsx`
- [ ] `admin/courses/[id]/lessons/new/page.tsx`
- [ ] `admin/courses/[id]/lessons/[lessonId]/page.tsx`
- [ ] `admin/courses/new/page.tsx`
- [ ] `admin/posts/page.tsx`
- [ ] `admin/posts/[id]/page.tsx`
- [ ] `admin/posts/new/page.tsx`

### API routes without tests (8 files)
- [ ] `api/payments/webhook/route.ts`
- [ ] `api/payments/portal/route.ts`
- [ ] `api/payments/checkout/route.ts`
- [ ] `api/puzzles/route.ts`
- [ ] `api/puzzles/daily/route.ts`
- [ ] `api/puzzles/[id]/route.ts`
- [ ] `api/quizzes/[quizId]/questions/route.ts`
- [ ] `api/quizzes/[quizId]/attempts/[attemptId]/submit/route.ts`

### Components without tests (8 files)
- [ ] `components/ui/progress.tsx`
- [ ] `components/layout/NotificationBell.tsx`
- [ ] `components/chess/AICoachPanel.tsx`
- [ ] `components/chess/ChessPieceIcon.tsx`
- [ ] `components/quiz/QuizResult.tsx`
- [ ] `components/quiz/QuizViewer.tsx`
- [ ] `components/landing/AnimatedChessBoard.tsx`
- [ ] `components/shared/CheckoutButton.tsx`

### E2E tests missing
- [ ] Dashboard pages (analysis, progress, groups, leaderboard, puzzles, social, tournaments)
- [ ] Admin pages
- [ ] User profiles
- [ ] Blog slug pages
- [ ] Course/lesson detail pages

---

## Execution Order (Priority)

1. **Fix i18n** — 6 locales broken (app crash risk)
2. **Sidebar + DashboardLayout** — blocking all dashboard UX
3. **Payment API tests** — critical untested Stripe integration
4. **Fix translation errors** — Chinese in Persian, English in Russian, accents in French/German
5. **Homework system** — Phase 3 gap
6. **Admin features** — user mgmt, puzzle mgmt, moderation
7. **Real-time chat** — Phase 5 gap
8. **Coaching booking API** — Phase 9 gap
9. **Weekly challenges** — Phase 6 gap
10. **Page/component tests** — 29 pages + 8 components
11. **Home page polish** — "Who It's For" + pricing section
12. **Blog enhancements** — images, author, content, filtering
13. **Pricing toggle**, PWA, SEO
14. **`games` + `payments` tables**, email verification, password reset
