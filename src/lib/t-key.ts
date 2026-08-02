import type { useTranslations } from 'next-intl';

type Translator = ReturnType<typeof useTranslations>;

/**
 * Resolve a database i18n key (e.g. "_courses.chessFundamentals.title")
 * to its translated value using next-intl's getTranslations/useTranslations.
 * Falls back to the raw value if translation is missing.
 */
export function tKey(value: string | null, t: Translator): string {
  if (!value) return '';
  const trimmed = value.trim();
  if (trimmed.startsWith('_courses.')) {
    const result = (t as unknown as (key: string) => string)(trimmed);
    if (result === trimmed) return trimmed;
    return result;
  }
  return trimmed;
}
