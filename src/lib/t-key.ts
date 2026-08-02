import type { useTranslations } from 'next-intl';

type Translator = ReturnType<typeof useTranslations>;

/**
 * Resolve a database i18n key using :: as path separator.
 * DB stores e.g. "_courses::chessFundamentals::title"
 * which maps to JSON path _courses.chessFundamentals.title
 */
export function tKey(value: string | null, t: Translator): string {
  if (!value) return '';
  const trimmed = value.trim();
  if (trimmed.startsWith('_courses::')) {
    // Replace :: with . for next-intl nested key lookup
    const key = trimmed.replace(/::/g, '.');
    const result = (t as unknown as (key: string) => string)(key);
    if (result === key) return trimmed;
    return result;
  }
  return trimmed;
}
