import type { useTranslations } from 'next-intl';

type Translator = ReturnType<typeof useTranslations>;

/**
 * Resolve a database i18n key.
 * DB stores e.g. "coursesContent::chessFundamentals::title"
 * or legacy "_courses::chessFundamentals::title"
 * both map to JSON path coursesContent.chessFundamentals.title
 */
export function tKey(value: string | null, t: Translator): string {
  if (!value) return '';
  const trimmed = value.trim();
  if (trimmed.startsWith('coursesContent::') || trimmed.startsWith('_courses::')) {
    const key = trimmed.replace(/::/g, '.').replace(/^_courses/, 'coursesContent');
    const result = (t as unknown as (key: string) => string)(key);
    if (result === key) return trimmed;
    return result;
  }
  return trimmed;
}
