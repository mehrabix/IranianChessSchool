import { describe, it, expect } from 'vitest';
import { tKey } from './t-key';

function makeT(translations: Record<string, string>) {
  return ((key: string) => translations[key] ?? key) as ReturnType<typeof import('next-intl').useTranslations>;
}

describe('tKey', () => {
  it('returns empty string for null/empty', () => {
    expect(tKey(null, makeT({}))).toBe('');
    expect(tKey('', makeT({}))).toBe('');
  });

  it('returns plain text unchanged', () => {
    expect(tKey('Hello World', makeT({}))).toBe('Hello World');
  });

  it('resolves coursesContent:: nested key', () => {
    const t = makeT({
      'coursesContent.chessFundamentals.title': 'مبانی شطرنج',
    });
    expect(tKey('coursesContent::chessFundamentals::title', t)).toBe('مبانی شطرنج');
  });

  it('resolves coursesContent:: module key', () => {
    const t = makeT({
      'coursesContent.chessFundamentals.modules.board': 'صفحه و مهره‌ها',
    });
    expect(tKey('coursesContent::chessFundamentals::modules::board', t)).toBe('صفحه و مهره‌ها');
  });

  it('resolves coursesContent:: lesson key', () => {
    const t = makeT({
      'coursesContent.chessFundamentals.lessons.intro': 'معرفی صفحه شطرنج',
    });
    expect(tKey('coursesContent::chessFundamentals::lessons::intro', t)).toBe('معرفی صفحه شطرنج');
  });

  it('returns raw key if translation missing', () => {
    const t = makeT({});
    expect(tKey('coursesContent::chessFundamentals::title', t)).toBe('coursesContent::chessFundamentals::title');
  });
});
