'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function NotFound() {
  const t = useTranslations('common');
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-8xl font-bold text-muted-foreground/20">404</h1>
        <h2 className="text-2xl font-semibold">{t('notFound') || 'Page not found'}</h2>
        <p className="text-muted-foreground">{t('pageNotFoundDesc') || 'The page you are looking for does not exist.'}</p>
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline">
          {t('goBackHome') || 'Go back home'}
        </Link>
      </div>
    </div>
  );
}
