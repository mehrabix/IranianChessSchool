export const XP_VALUES = {
  COMPLETE_LESSON: 50,
  SOLVE_PUZZLE: 10,
  DAILY_LOGIN: 5,
  COMPLETE_MODULE: 200,
  COMPLETE_COURSE: 1000,
  CREATE_POST: 15,
  ADD_COMMENT: 5,
  RECEIVE_LIKE: 2,
};

export const LEVELS = [
  { level: 1, title: 'Bronze', minXp: 0 },
  { level: 6, title: 'Silver', minXp: 500 },
  { level: 11, title: 'Gold', minXp: 2000 },
  { level: 16, title: 'Platinum', minXp: 5000 },
  { level: 21, title: 'Diamond', minXp: 10000 },
  { level: 26, title: 'Master', minXp: 20000 },
  { level: 31, title: 'Grandmaster', minXp: 40000 },
];

export function getLevel(xp: number): { level: number; title: string; nextLevelXp: number } {
  let currentLevel = LEVELS[0];
  let nextXp = LEVELS[1]?.minXp || Infinity;

  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) {
      currentLevel = LEVELS[i];
      nextXp = LEVELS[i + 1]?.minXp || Infinity;
      const levelOffset = Math.floor((xp - currentLevel.minXp) / (nextXp - currentLevel.minXp) * 5);
      const level = currentLevel.level + levelOffset;
      return { level, title: currentLevel.title, nextLevelXp: nextXp };
    }
  }

  return { level: 1, title: 'Bronze', nextLevelXp: LEVELS[1]?.minXp || 500 };
}

export function xpToNextLevel(xp: number): number {
  const { nextLevelXp } = getLevel(xp);
  return Math.max(0, nextLevelXp - xp);
}
