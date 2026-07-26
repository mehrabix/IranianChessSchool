import { db, users as usersTable, progress, eq, and, sql } from '@/lib/db';

export async function updateStreak(userId: string): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today.getTime() - 86400000);
  const yesterdayTs = Math.floor(yesterday.getTime() / 1000);
  const todayTs = Math.floor(today.getTime() / 1000);

  const [user] = await db.select({ streak: usersTable.streak, lastActive: usersTable.lastActive })
    .from(usersTable).where(eq(usersTable.id, userId)).limit(1);

  if (!user) return 0;

  const lastActive = user.lastActive ? new Date(Number(user.lastActive) * 1000) : null;
  const lastActiveDay = lastActive ? new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate()).getTime() : 0;

  let newStreak = 1;
  if (lastActiveDay === today.getTime()) {
    newStreak = (user.streak || 0);
  } else if (lastActiveDay === yesterday.getTime()) {
    newStreak = (user.streak || 0) + 1;
  }

  await db.update(usersTable).set({
    streak: newStreak,
    lastActive: new Date(todayTs * 1000),
  }).where(eq(usersTable.id, userId));

  return newStreak;
}

export async function addXp(userId: string, amount: number): Promise<void> {
  await db.update(usersTable).set({
    xp: sql`${usersTable.xp} + ${amount}`,
  }).where(eq(usersTable.id, userId));
  await updateStreak(userId);
}
