import { describe, it, expect } from 'vitest';
import { tKey } from './t-key';

function makeT(translations: Record<string, string>) {
  return ((key: string) => translations[key] ?? key) as ReturnType<typeof import('next-intl').useTranslations>;
}

describe('tKey', () => {
  const t = makeT({
    'coursesContent.chessFundamentals.title': 'مبانی شطرنج',
    'coursesContent.chessFundamentals.modules.board': 'صفحه و مهره‌ها',
    'coursesContent.chessFundamentals.lessons.intro': 'معرفی صفحه شطرنج',
  });

  it('returns empty for null/empty', () => {
    expect(tKey(null, t)).toBe('');
    expect(tKey('', t)).toBe('');
  });

  it('returns plain text unchanged', () => {
    expect(tKey('Hello', t)).toBe('Hello');
  });

  it('resolves coursesContent:: key', () => {
    expect(tKey('coursesContent::chessFundamentals::title', t)).toBe('مبانی شطرنج');
  });

  it('resolves legacy _courses:: key', () => {
    expect(tKey('_courses::chessFundamentals::title', t)).toBe('مبانی شطرنج');
  });

  it('resolves legacy nested key', () => {
    expect(tKey('_courses::chessFundamentals::modules::board', t)).toBe('صفحه و مهره‌ها');
    expect(tKey('_courses::chessFundamentals::lessons::intro', t)).toBe('معرفی صفحه شطرنج');
  });
});
