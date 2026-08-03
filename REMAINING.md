# IranianChessSchool — Remaining Tasks

> Updated 2026-08-03 — verified against actual codebase state

---

## ✅ Done This Session

- **i18n fix**: 200+ untranslated strings across fa/ru/it/de/fr/no.json
- **Pricing FAQ**: Replaced `<details>` with shadcn Accordion
- **DashboardLayout + Sidebar**: Already exist (DashboardLayout.tsx with collapsible sidebar)
- **games + payments tables**: Already in drizzle/schema.ts
- **lint CI job**: Already in .github/workflows/ci.yml
- **Blog images**: SVG placeholders added to post cards
- **Payment API tests**: 15 tests for checkout/portal/webhook (all passing)
- **Responsive design**: Navbar (icons-only md, labels lg+), ChessBoard (w-full responsive), analysis page (xl sidebar)
- **Blog slug pages**: Already exist

---

## 🟡 Phase 1 — Foundation Gaps
- [ ] Build email verification flow (send + verify page)
- [ ] Build password reset flow (forgot + reset pages)

## 🟡 Phase 2 — Public Pages
- [ ] Blog: Add author field to posts

## 🟡 Phase 5 — Social Features
- [ ] Build real-time chat (Socket.io server + client)

## 🟡 Phase 6 — Gamification
- [ ] Build weekly challenges UI (table + API already exist)

## 🟡 Phase 8 — Admin Dashboard
- [ ] Build admin user management (list, ban, role assignment)
- [ ] Build admin puzzle management (CRUD)
- [ ] Build moderation tools (flagging system, moderation queue)
- [ ] Add WYSIWYG editor to admin content forms

## 🟡 Phase 9 — Advanced Features
- [ ] Build coaching booking API routes
- [ ] Build PWA service worker
- [ ] Add `robots.txt`
- [ ] Add SEO meta/OG tags to all pages

## 🔴 Test Coverage Gaps
### API routes without tests
- [ ] `api/puzzles/route.ts`
- [ ] `api/puzzles/daily/route.ts`
- [ ] `api/puzzles/[id]/route.ts`
- [ ] `api/quizzes/[quizId]/questions/route.ts`
- [ ] `api/quizzes/[quizId]/attempts/[attemptId]/submit/route.ts`

### Components without tests
- [ ] `components/ui/progress.tsx`
- [ ] `components/layout/NotificationBell.tsx`
- [ ] `components/chess/AICoachPanel.tsx`
- [ ] `components/chess/ChessPieceIcon.tsx`
- [ ] `components/quiz/QuizResult.tsx`
- [ ] `components/quiz/QuizViewer.tsx`
- [ ] `components/landing/AnimatedChessBoard.tsx`
- [ ] `components/shared/CheckoutButton.tsx`
