# IranianChessSchool — Agent Instructions

## Project Overview
IranianChessSchool is a chess training, learning, and social media platform built with Next.js 16, NextAuth, shadcn/ui, Tailwind CSS v4, Turso (SQLite edge), and Drizzle ORM. i18n with next-intl (7 languages: en, fa, ru, it, de, fr, no).

## Key Conventions
- Use `pnpm` for all package management (never npm/yarn)
- All pages are under `src/app/[locale]/` with Next.js App Router
- Components live in `src/components/` (ui/ for shadcn, layout/ for layout components)
- DB schema in `drizzle/schema.ts`, client in `src/lib/db.ts`
- Auth via NextAuth v5 in `src/lib/auth.ts`
- TypeScript strict mode is enabled
- shadcn/ui components are the design system - use existing patterns

## Testing (Hard Rule)
Every feature/component MUST have tests before marking complete:
- **Unit** (Vitest): functions, hooks, utilities, chess logic
- **Integration** (Vitest + MSW): API routes, database queries, auth flows
- **E2E** (Playwright): user flows (signup → browse → purchase → learn → play)

Test files live next to source code. Use `pnpm test:unit`, `pnpm test:e2e`, or `pnpm test:all`.

## Agents
- `@code-review` — Reviews code for best practices, security, and issues (read-only)
- `@debug` — Investigates build errors, runtime bugs, and test failures (read-only)
- `@docs` — Writes and maintains documentation, locale files
- `@test` — Runs unit, integration, and E2E tests

## MCP Tools
- `playwright` — Browser automation for E2E testing
- `context7` — Search through library/framework docs
- `gh_grep` — Search code examples on GitHub

When you need to search docs or find code examples, use `context7` or `gh_grep` tools.

## Important
- Never commit secrets or .env files
- Follow the MASTERPLAN.md for phase roadmap
- Keep existing code style and conventions
- Use next-intl Link from `@/i18n/routing` for internal links
