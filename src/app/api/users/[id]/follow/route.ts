import { NextRequest, NextResponse } from 'next/server';
import { db, follows, eq, and } from '@/lib/db';
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
      return NextResponse.json({ following: true });
    }
  } catch {
    return NextResponse.json({ error: 'Failed to toggle follow' }, { status: 500 });
  }
}
