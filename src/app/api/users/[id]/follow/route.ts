import { NextRequest, NextResponse } from 'next/server';
import { db, follows, notifications, users as usersTable, eq, and } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: followingId } = await params;
  const followerId = session.user.id;
  if (followerId === followingId) {
    return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });
  }

  try {
    const existing = await db
      .select()
      .from(follows)
      .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)))
      .limit(1);

    if (existing.length > 0) {
      await db.delete(follows).where(eq(follows.id, existing[0].id));
      return NextResponse.json({ following: false });
    } else {
      await db.insert(follows).values({ id: crypto.randomUUID(), followerId, followingId });
      const [follower] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, followerId)).limit(1);
      await db.insert(notifications).values({
        id: crypto.randomUUID(), userId: followingId, type: 'FOLLOW',
        title: `${follower?.name || 'Someone'} started following you`,
        link: `/users/${followerId}`,
      });
      return NextResponse.json({ following: true });
    }
  } catch {
    return NextResponse.json({ error: 'Failed to toggle follow' }, { status: 500 });
  }
}
