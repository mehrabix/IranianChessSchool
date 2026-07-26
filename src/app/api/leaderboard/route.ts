import { NextResponse } from 'next/server';
import { db, users as usersTable, desc } from '@/lib/db';

export async function GET() {
  try {
    const all = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        image: usersTable.image,
        xp: usersTable.xp,
        level: usersTable.level,
        rating: usersTable.rating,
      })
      .from(usersTable)
      .orderBy(desc(usersTable.xp))
      .limit(50);

    return NextResponse.json({ users: all });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
