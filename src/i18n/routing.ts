import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const locales = ['en', 'fa', 'ru', 'it', 'de', 'fr', 'no'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  fa: 'فارسی',
  ru: 'Русский',
  it: 'Italiano',
  de: 'Deutsch',
  fr: 'Français',
  no: 'Norsk',
};

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always',
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
