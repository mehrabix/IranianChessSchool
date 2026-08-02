import type { useTranslations } from 'next-intl';

type Translator = ReturnType<typeof useTranslations>;

/**
 * Resolve a database i18n key.
 * DB stores e.g. "coursesContent::chessFundamentals::title"
 * which maps to JSON path coursesContent.chessFundamentals.title
 */
export function tKey(value: string | null, t: Translator): string {
  if (!value) return '';
  const trimmed = value.trim();
  if (trimmed.startsWith('coursesContent::')) {
    const key = trimmed.replace(/::/g, '.');
    const result = (t as unknown as (key: string) => string)(key);
    if (result === trimmed || result === key) return trimmed;
    return result;
  }
  return trimmed;
}
