import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { addXp } from '@/lib/streak';
import { checkAchievements } from '@/lib/achievements';
import { XP_VALUES, getLevel } from '@/lib/xp';
import { db, users as usersTable, eq } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { action } = await req.json();
    const xpAmount = XP_VALUES[action as keyof typeof XP_VALUES];
    if (!xpAmount) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await addXp(session.user.id, xpAmount);
    const achievements = await checkAchievements(session.user.id);

    const [user] = await db.select({ xp: usersTable.xp, level: usersTable.level, streak: usersTable.streak })
      .from(usersTable).where(eq(usersTable.id, session.user.id)).limit(1);

    const levelInfo = getLevel(user?.xp || 0);
    const leveledUp = levelInfo.level !== (user?.level || 1);

    if (leveledUp) {
      await db.update(usersTable).set({ level: levelInfo.level }).where(eq(usersTable.id, session.user.id));
    }

    return NextResponse.json({
      xp: user?.xp, level: levelInfo.level, streak: user?.streak,
      leveledUp, xpEarned: xpAmount,
      achievements: achievements.map(a => ({ title: a.title, description: a.description, xp: a.xpReward })),
    });
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
