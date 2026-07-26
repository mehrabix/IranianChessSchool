import { NextResponse } from 'next/server';
import { db, users as usersTable, courses, posts, progress, sql } from '@/lib/db';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(usersTable);
    const [courseCount] = await db.select({ count: sql<number>`count(*)` }).from(courses);
    const [postCount] = await db.select({ count: sql<number>`count(*)` }).from(posts);
    const [completedCount] = await db.select({ count: sql<number>`count(*)` }).from(progress).where(sql`completed = 1`);
    const [activeToday] = await db.select({ count: sql<number>`count(*)` }).from(usersTable).where(sql`last_active >= unixepoch('now', 'start of day')`);

    const topUsers = await db.select({ name: usersTable.name, xp: usersTable.xp, level: usersTable.level, streak: usersTable.streak })
      .from(usersTable).orderBy(sql`xp desc`).limit(5);

    return NextResponse.json({
      users: userCount.count,
      courses: courseCount.count,
      posts: postCount.count,
      completed: completedCount.count,
      activeToday: activeToday.count,
      topUsers,
    });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
