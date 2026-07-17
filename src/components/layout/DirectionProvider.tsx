'use client';

import { useEffect, useRef } from 'react';
import { rtlLocales } from '@/i18n/routing';

export function DirectionProvider({ children }: { children: React.ReactNode }) {
  const localeRef = useRef('en');

  useEffect(() => {
    const update = () => {
      const path = window.location.pathname;
      const locale = path.split('/')[1] || 'en';
      localeRef.current = locale;
      const isRtl = rtlLocales.includes(locale as any);
      document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
      document.documentElement.lang = locale;
      document.documentElement.classList.toggle('font-fa', locale === 'fa');
    };
    update();
    const observer = new MutationObserver(() => {
      const newLang = document.documentElement.lang;
      if (newLang !== localeRef.current) update();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
}
