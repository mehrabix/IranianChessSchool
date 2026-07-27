import { describe, it, expect, vi, beforeEach } from 'vitest';

// --- Mocks ---
const { mockDb, mockInsertValues } = vi.hoisted(() => {
  const insertResult = { values: vi.fn(() => Promise.resolve()) };
  const db: Record<string, any> = {
    select: vi.fn(() => db),
    from: vi.fn(() => db),
    where: vi.fn(() => db),
    limit: vi.fn(() => db),
    insert: vi.fn(() => insertResult),
  };
  return { mockDb: db, mockInsertValues: insertResult.values };
});

vi.mock('@/lib/db', () => ({
  db: mockDb,
  eq: vi.fn((a: any, b: any) => ({ left: a, right: b })),
  and: vi.fn(),
  sql: (literals: TemplateStringsArray, ...exprs: any[]) => ({ as: 'sql' }),
  users: { id: 'id', streak: 'streak' },
  achievements: { userId: 'userId', type: 'type', id: 'id' },
  progress: { userId: 'userId', completed: 'completed', lessonId: 'lessonId' },
}));

vi.stubGlobal('crypto', {
  randomUUID: () => '00000000-0000-0000-0000-000000000000',
});

import { checkAchievements } from './achievements';

/**
 * Sets up the thenable behaviour on mockDb so that `await mockDb`
 * resolves to the next value in `results` (FIFO).
 */
function queueQueryResults(...results: any[]) {
  let i = 0;
  mockDb.then = (_resolve: any, _reject: any) => {
    _resolve(results[i++]);
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('checkAchievements', () => {
  it('returns empty array when user not found', async () => {
    queueQueryResults([]); // db.select().from(users) → no rows

    const result = await checkAchievements('u-nonexistent');

    expect(result).toEqual([]);
  });

  it('returns FIRST_LESSON achievement for user with completed lessons', async () => {
    queueQueryResults(
      [{ id: 'u1', streak: 0 }], // user
      [], // existing achievements
      [{ count: 3 }], // 3 completed lessons
      [{ count: 0 }], // 0 courses
    );

    const result = await checkAchievements('u1');

    const types = result.map((a) => a.type);
    expect(types).toContain('FIRST_LESSON');
    // FIRST_PUZZLE / FIRST_POST / FIRST_COMMENT are always true in the
    // current implementation, so they also appear.
    expect(types).toContain('FIRST_PUZZLE');
    expect(types).toContain('FIRST_POST');
    expect(types).toContain('FIRST_COMMENT');
  });

  it('returns STREAK_7 when user has 7+ day streak', async () => {
    queueQueryResults(
      [{ id: 'u2', streak: 7 }], // user with streak 7
      [], // no existing achievements
      [{ count: 0 }], // 0 completed lessons
      [{ count: 0 }], // 0 courses
    );

    const result = await checkAchievements('u2');

    expect(result.some((a) => a.type === 'STREAK_7')).toBe(true);
  });

  it('skips already earned achievements (not returned in result)', async () => {
    queueQueryResults(
      [{ id: 'u3', streak: 5 }], // user
      [{ type: 'FIRST_LESSON' }], // already has FIRST_LESSON
      [{ count: 5 }], // 5 completed lessons → qualifies for FIRST_LESSON
      [{ count: 0 }],
    );

    const result = await checkAchievements('u3');

    expect(result.some((a) => a.type === 'FIRST_LESSON')).toBe(false);
    // achievements that are always earned should still appear
    expect(result.some((a) => a.type === 'FIRST_PUZZLE')).toBe(true);
  });

  it('does not insert achievements the user already has', async () => {
    queueQueryResults(
      [{ id: 'u4', streak: 10 }], // user with streak 10
      [{ type: 'STREAK_7' }], // already has STREAK_7
      [{ count: 0 }],
      [{ count: 0 }],
    );

    await checkAchievements('u4');

    // FIRST_PUZZLE, FIRST_POST, FIRST_COMMENT are always earned and not
    // already held, so insert should be called 4 times (those 3 + the
    // user fetch, existing-ach fetch, and two progress queries).
    // We verify that no insert call carried a STREAK_7 value.
    const insertedTypes: string[] = [];
    for (const call of mockInsertValues.mock.calls) {
      const arg = call[0] as Record<string, any> | undefined;
      if (arg?.type) insertedTypes.push(arg.type);
    }

    expect(insertedTypes).not.toContain('STREAK_7');
  });
});
