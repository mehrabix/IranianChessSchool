# IranianChessSchool — Remaining Tasks

> Updated 2026-08-03 — verified against actual codebase state

---

## ✅ Done This Session

- **i18n fix**: 200+ untranslated strings across fa/ru/it/de/fr/no.json — all now translated. Remaining "untranslated" keys are intentional (proper nouns, names, prices, FEN/PGN/PGN-notation).
- **Pricing FAQ**: Replaced `<details>` with shadcn Accordion component.
- **Verified**: `DashboardLayout.tsx`, `Sidebar` (via DashboardLayout), `games` table, `payments` table, `lint` CI job — all already exist.
- **REMAINING.md**: Updated to reflect actual state.

---

## 🟡 Phase 1 — Foundation Gaps

- [ ] Build email verification flow (send + verify page)
- [ ] Build password reset flow (forgot + reset pages)

---

## 🟡 Phase 2 — Public Pages

- [ ] Blog: Add images to post cards (image paths exist but not displayed)
- [ ] Blog: Add author field to posts
- [ ] Tests: Unit tests for all 8 public page components

---

## 🟡 Phase 3 — Learning Platform

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

- [ ] Build weekly challenges UI (table + API already exist)

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
