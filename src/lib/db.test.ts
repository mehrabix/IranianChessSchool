import { describe, it, expect, vi } from 'vitest';

vi.mock('@libsql/client', () => ({
  createClient: vi.fn(() => ({ execute: vi.fn() })),
}));

vi.mock('drizzle-orm/libsql', () => ({
  drizzle: vi.fn(() => ({ select: vi.fn() })),
}));

describe('db', () => {
  it('exports db and operators', async () => {
    const dbMod = await import('@/lib/db');
    expect(dbMod.db).toBeDefined();
    expect(dbMod.eq).toBeDefined();
    expect(dbMod.and).toBeDefined();
    expect(dbMod.or).toBeDefined();
    expect(dbMod.desc).toBeDefined();
    expect(dbMod.asc).toBeDefined();
    expect(dbMod.sql).toBeDefined();
    expect(dbMod.like).toBeDefined();
    expect(dbMod.inArray).toBeDefined();
    expect(dbMod.between).toBeDefined();
    expect(dbMod.not).toBeDefined();
    expect(dbMod.isNull).toBeDefined();
    expect(dbMod.isNotNull).toBeDefined();
  });

  it('exports table schemas', async () => {
    const dbMod = await import('@/lib/db');
    expect(dbMod.users).toBeDefined();
    expect(dbMod.accounts).toBeDefined();
    expect(dbMod.sessions).toBeDefined();
    expect(dbMod.verificationTokens).toBeDefined();
    expect(dbMod.courses).toBeDefined();
    expect(dbMod.modules).toBeDefined();
    expect(dbMod.lessons).toBeDefined();
    expect(dbMod.puzzles).toBeDefined();
    expect(dbMod.progress).toBeDefined();
    expect(dbMod.subscriptions).toBeDefined();
    expect(dbMod.posts).toBeDefined();
    expect(dbMod.achievements).toBeDefined();
    expect(dbMod.bookings).toBeDefined();
  });
});
