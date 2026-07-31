import { describe, it, expect } from 'vitest';
import { locales, localeNames, rtlLocales, routing } from '@/i18n/routing';

describe('i18n routing config', () => {
  it('has all 8 locales', () => {
    expect(locales).toEqual(['en', 'fa', 'ru', 'it', 'de', 'fr', 'no', 'es']);
  });

  it('has locale names for all locales', () => {
    expect(localeNames.en).toBe('English');
    expect(localeNames.fa).toBe('فارسی');
    expect(localeNames.ru).toBe('Русский');
    expect(localeNames.it).toBe('Italiano');
    expect(localeNames.de).toBe('Deutsch');
    expect(localeNames.fr).toBe('Français');
    expect(localeNames.no).toBe('Norsk');
    expect(localeNames.es).toBe('Español');
  });

  it('has correct RTL locales', () => {
    expect(rtlLocales).toEqual(['fa']);
  });

  it('has correct routing config', () => {
    expect(routing.defaultLocale).toBe('en');
    expect(routing.localePrefix).toBe('always');
    expect(routing.locales).toEqual(locales);
  });
});
