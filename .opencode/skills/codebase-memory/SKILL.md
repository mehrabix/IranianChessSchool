---
name: codebase-memory
description: Use when exploring the codebase structure, understanding architecture, finding how features are implemented, or tracing code flow across the IranianChessSchool project.
---

# IranianChessSchool Codebase Guide

## Architecture
- **Framework**: Next.js 16.2.10 with App Router
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Database**: Turso (SQLite edge) via Drizzle ORM
- **Auth**: NextAuth v5 with JWT strategy
- **i18n**: next-intl v4 with 7 locales (en, fa, ru, it, de, fr, no)

## Directory Layout
```
src/
├── app/[locale]/          # All pages (i18n-routed)
│   ├── admin/             # Admin dashboard & CRUD pages
│   ├── auth/              # Sign in, register
│   ├── courses/           # Public course browsing & lessons
│   ├── dashboard/         # User dashboard
│   └── (public pages)     # about, blog, contact, faq, kids, pricing
├── app/api/               # API route handlers
│   ├── admin/             # Admin-only API routes
│   ├── courses/           # Public course API
│   ├── lessons/           # Lesson API
│   ├── progress/          # Progress tracking API
│   ├── posts/             # Blog posts API
│   ├── contact/           # Contact form API
│   └── auth/              # NextAuth handler
├── components/
│   ├── ui/                # shadcn/ui components
│   └── layout/            # Navbar, Footer, LanguageSwitcher
├── lib/
│   ├── auth.ts            # NextAuth configuration
│   ├── db.ts              # Drizzle client + exports
│   └── utils.ts           # Utility functions (cn)
├── i18n/                  # i18n routing & request config
└── messages/              # Translation JSON files
```

## Key Patterns
- **Server Components**: Default for pages; `'use client'` for interactivity
- **Params**: Use `Promise<{ id: string }>` with `await props.params`
- **Client side params**: Use `use(props.params)` from React
- **Auth guards**: `auth()` from `@/lib/auth`, check `session.user.role`
- **DB queries**: Drizzle ORM with `db.select()`, `.where(eq(...))`, etc.
