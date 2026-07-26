import { db, users as usersTable, achievements, progress, eq, sql, and } from '@/lib/db';

interface AchievementDef {
  type: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
}

const ACHIEVEMENTS: AchievementDef[] = [
  { type: 'FIRST_PUZZLE', title: 'First Puzzle Solved', description: 'Solved your first puzzle', icon: 'Target', xpReward: 50 },
  { type: 'TEN_PUZZLES', title: 'Puzzle Apprentice', description: 'Solved 10 puzzles', icon: 'Lightbulb', xpReward: 100 },
  { type: 'HUNDRED_PUZZLES', title: 'Puzzle Master', description: 'Solved 100 puzzles', icon: 'Brain', xpReward: 500 },
  { type: 'FIRST_LESSON', title: 'First Steps', description: 'Completed your first lesson', icon: 'BookOpen', xpReward: 50 },
  { type: 'FIRST_COURSE', title: 'Course Graduate', description: 'Completed your first course', icon: 'GraduationCap', xpReward: 500 },
  { type: 'STREAK_7', title: 'Week Warrior', description: '7-day streak', icon: 'Flame', xpReward: 200 },
  { type: 'STREAK_30', title: 'Monthly Master', description: '30-day streak', icon: 'Trophy', xpReward: 1000 },
  { type: 'FIRST_POST', title: 'Social Starter', description: 'Created your first post', icon: 'MessageCircle', xpReward: 30 },
  { type: 'FIRST_COMMENT', title: 'Conversationalist', description: 'Wrote your first comment', icon: 'MessageSquare', xpReward: 20 },
];

export async function checkAchievements(userId: string): Promise<AchievementDef[]> {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  if (!user) return [];

  const existingAchievements = await db.select({ type: achievements.type }).from(achievements).where(eq(achievements.userId, userId));
  const existingTypes = new Set(existingAchievements.map(a => a.type));

  const completedLessons = await db.select({ count: sql<number>`count(*)` })
    .from(progress).where(and(eq(progress.userId, userId), eq(progress.completed, true)));

  const completedCourses = await db.select({ count: sql<number>`count(distinct ${progress.lessonId})` })
    .from(progress).where(and(eq(progress.userId, userId), eq(progress.completed, true)));

  const newAchievements: AchievementDef[] = [];

  for (const ach of ACHIEVEMENTS) {
    if (existingTypes.has(ach.type)) continue;

    let earned = false;
    const lessonCount = completedLessons[0]?.count || 0;
    const streak = user.streak || 0;

    switch (ach.type) {
      case 'FIRST_PUZZLE': earned = true; break;
      case 'TEN_PUZZLES': earned = lessonCount >= 10; break;
      case 'HUNDRED_PUZZLES': earned = lessonCount >= 100; break;
      case 'FIRST_LESSON': earned = lessonCount >= 1; break;
      case 'FIRST_COURSE': earned = (completedCourses[0]?.count || 0) >= 1; break;
      case 'STREAK_7': earned = streak >= 7; break;
      case 'STREAK_30': earned = streak >= 30; break;
      case 'FIRST_POST': earned = true; break;
      case 'FIRST_COMMENT': earned = true; break;
    }

    if (earned) {
      await db.insert(achievements).values({
        id: crypto.randomUUID(), userId, type: ach.type, title: ach.title,
        description: ach.description, icon: ach.icon, xpReward: ach.xpReward,
      });
      newAchievements.push(ach);
    }
  }

  return newAchievements;
}
