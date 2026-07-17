---
name: nextjs-shadcn
description: Use when building Next.js pages, components, or API routes using shadcn/ui and Tailwind CSS. Covers shadcn component patterns, styling conventions, and API route structure for this project.
---

# Next.js + shadcn/ui for IranianChessSchool

## Page Structure
All pages go under `src/app/[locale]/` for i18n support. Each locale page is a server component by default; add `'use client'` when needed.

```tsx
// src/app/[locale]/example/page.tsx
import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/container';

export default async function ExamplePage() {
  const t = await getTranslations('example');
  return (
    <Container size="lg">
      <h1>{t('title')}</h1>
    </Container>
  );
}
```

## shadcn/ui Components
Import from `@/components/ui/<name>`:
- `Button` with `render` prop for Link/as-child usage
- `Card`, `CardContent`, `CardHeader`, `CardTitle` for cards
- `Badge` for labels
- `Input`, `Textarea`, `Label` for forms
- Use lucide-react icons

## API Routes
Place under `src/app/api/<name>/route.ts`. Export GET, POST, PUT, DELETE handlers.

Use `auth()` from `@/lib/auth` for session checking:
```ts
import { auth } from '@/lib/auth';
const session = await auth();
if (!session?.user || session.user.role !== 'ADMIN') {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

## Database Queries
Import from `@/lib/db`:
```ts
import { db, courses, modules, lessons, eq, asc, desc, and, sql } from '@/lib/db';
```

## i18n
- Server components: `import { getTranslations } from 'next-intl/server'`
- Client components: `import { useTranslations } from 'next-intl'`
- Internal links: `import { Link } from '@/i18n/routing'`
