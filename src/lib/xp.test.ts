import { describe, it, expect } from 'vitest';
import { XP_VALUES, getLevel, xpToNextLevel } from '@/lib/xp';

describe('XP_VALUES', () => {
  it('has correct values for known keys', () => {
    expect(XP_VALUES.COMPLETE_LESSON).toBe(50);
    expect(XP_VALUES.SOLVE_PUZZLE).toBe(10);
    expect(XP_VALUES.DAILY_LOGIN).toBe(5);
    expect(XP_VALUES.COMPLETE_MODULE).toBe(200);
    expect(XP_VALUES.COMPLETE_COURSE).toBe(1000);
    expect(XP_VALUES.CREATE_POST).toBe(15);
    expect(XP_VALUES.ADD_COMMENT).toBe(5);
    expect(XP_VALUES.RECEIVE_LIKE).toBe(2);
  });
});

describe('getLevel', () => {
  it.each([
    [0, { level: 1, title: 'Bronze', nextLevelXp: 500 }],
    [300, { level: 4, title: 'Bronze', nextLevelXp: 500 }],
    [500, { level: 6, title: 'Silver', nextLevelXp: 2000 }],
    [2000, { level: 11, title: 'Gold', nextLevelXp: 5000 }],
    [5000, { level: 16, title: 'Platinum', nextLevelXp: 10000 }],
    [10000, { level: 21, title: 'Diamond', nextLevelXp: 20000 }],
    [20000, { level: 26, title: 'Master', nextLevelXp: 40000 }],
    [40000, { level: 31, title: 'Grandmaster', nextLevelXp: Infinity }],
  ])('returns correct result for XP %i', (xp, expected) => {
    expect(getLevel(xp)).toEqual(expected);
  });

  it('returns Bronze level 1 for negative XP', () => {
    expect(getLevel(-100)).toEqual({ level: 1, title: 'Bronze', nextLevelXp: 500 });
    expect(getLevel(-1)).toEqual({ level: 1, title: 'Bronze', nextLevelXp: 500 });
  });
});

describe('xpToNextLevel', () => {
  it.each([
    [0, 500],
    [250, 250],
    [499, 1],
    [3000, 2000],
    [7000, 3000],
    [12000, 8000],
    [25000, 15000],
    [50000, Infinity],
  ])('returns positive XP needed for XP %i', (xp, expected) => {
    const result = xpToNextLevel(xp);
    expect(result).toBeGreaterThan(0);
    expect(result).toBe(expected);
  });

  it('returns expected values at tier thresholds', () => {
    expect(xpToNextLevel(0)).toBe(500);
    expect(xpToNextLevel(500)).toBe(1500);
    expect(xpToNextLevel(2000)).toBe(3000);
    expect(xpToNextLevel(5000)).toBe(5000);
    expect(xpToNextLevel(10000)).toBe(10000);
    expect(xpToNextLevel(20000)).toBe(20000);
    expect(xpToNextLevel(40000)).toBe(Infinity);
  });
});
