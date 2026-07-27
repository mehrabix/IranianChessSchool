import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { updateStreak, addXp } from '@/lib/streak';

const mockDb = vi.hoisted(() => ({
  select: vi.fn(),
  update: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  db: mockDb,
  eq: vi.fn((a: any, b: any) => ({ left: a, right: b })),
  and: vi.fn(),
  sql: (literals: TemplateStringsArray, ...exprs: any[]) => ({
    literal: literals.join('?'),
    exprs,
  }),
  users: { streak: 'streak', lastActive: 'lastActive', id: 'id', xp: 'xp' },
  progress: { userId: 'userId', completed: 'completed' },
}));

const createSelectChain = () => ({
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  limit: vi.fn(),
});

const createUpdateChain = () => ({
  set: vi.fn().mockReturnThis(),
  where: vi.fn(),
});

let selectChain: ReturnType<typeof createSelectChain>;
let updateChain: ReturnType<typeof createUpdateChain>;

const getTodayMidnight = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const toUnix = (d: Date) => Math.floor(d.getTime() / 1000);

describe('updateStreak', () => {
  beforeEach(() => {
    selectChain = createSelectChain();
    updateChain = createUpdateChain();
    mockDb.select.mockClear();
    mockDb.update.mockClear();
    mockDb.select.mockReturnValue(selectChain);
    mockDb.update.mockReturnValue(updateChain);
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-07-27T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns 0 when user not found', async () => {
    selectChain.limit.mockResolvedValueOnce([]);

    const result = await updateStreak('user123');

    expect(result).toBe(0);
    expect(mockDb.update).not.toHaveBeenCalled();
  });

  it('sets streak to 1 on first activity (no lastActive)', async () => {
    selectChain.limit.mockResolvedValueOnce([{ streak: 0, lastActive: null }]);
    updateChain.where.mockResolvedValueOnce(undefined);

    const result = await updateStreak('user123');

    expect(result).toBe(1);
    expect(updateChain.set).toHaveBeenCalledWith(
      expect.objectContaining({ streak: 1, lastActive: expect.any(Date) }),
    );
  });

  it('increments streak when last active yesterday', async () => {
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    const yesterdayTs =
      toUnix(todayMidnight) - 86400 + 3600; // subtract 1 day, add 1 hour

    selectChain.limit.mockResolvedValueOnce([
      { streak: 5, lastActive: yesterdayTs },
    ]);
    updateChain.where.mockResolvedValueOnce(undefined);

    const result = await updateStreak('user123');

    expect(result).toBe(6);
    expect(updateChain.set).toHaveBeenCalledWith(
      expect.objectContaining({ streak: 6, lastActive: expect.any(Date) }),
    );
  });

  it('keeps same streak when already active today', async () => {
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    const todayTs = toUnix(todayMidnight) + 3600;

    selectChain.limit.mockResolvedValueOnce([
      { streak: 5, lastActive: todayTs },
    ]);
    updateChain.where.mockResolvedValueOnce(undefined);

    const result = await updateStreak('user123');

    expect(result).toBe(5);
    expect(updateChain.set).toHaveBeenCalledWith(
      expect.objectContaining({ streak: 5, lastActive: expect.any(Date) }),
    );
  });

  it('resets streak to 1 when gap > 1 day', async () => {
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    const threeDaysAgoTs = toUnix(todayMidnight) - 3 * 86400 + 3600;

    selectChain.limit.mockResolvedValueOnce([
      { streak: 10, lastActive: threeDaysAgoTs },
    ]);
    updateChain.where.mockResolvedValueOnce(undefined);

    const result = await updateStreak('user123');

    expect(result).toBe(1);
    expect(updateChain.set).toHaveBeenCalledWith(
      expect.objectContaining({ streak: 1, lastActive: expect.any(Date) }),
    );
  });
});

describe('addXp', () => {
  beforeEach(() => {
    selectChain = createSelectChain();
    updateChain = createUpdateChain();
    mockDb.select.mockClear();
    mockDb.update.mockClear();
    mockDb.select.mockReturnValue(selectChain);
    mockDb.update.mockReturnValue(updateChain);
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-07-27T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls db.update to add XP, then invokes updateStreak', async () => {
    // addXp's own db.update().set().where()
    updateChain.where.mockResolvedValueOnce(undefined);
    // updateStreak's db.select().from().where().limit()
    selectChain.limit.mockResolvedValueOnce([
      { streak: 3, lastActive: null },
    ]);
    // updateStreak's db.update().set().where()
    updateChain.where.mockResolvedValueOnce(undefined);

    await addXp('user123', 100);

    // Two db.update() calls: one from addXp, one from updateStreak
    expect(mockDb.update).toHaveBeenCalledTimes(2);
    // The first .set() is from addXp — it should carry the xp property
    expect(updateChain.set).toHaveBeenCalledWith(
      expect.objectContaining({
        xp: expect.objectContaining({
          literal: expect.any(String),
          exprs: expect.any(Array),
        }),
      }),
    );
    // updateStreak was invoked (its db.select() ran)
    expect(selectChain.limit).toHaveBeenCalled();
  });
});
