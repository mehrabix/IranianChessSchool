import { NextRequest, NextResponse } from 'next/server';
import { db, groups, groupMembers, eq, and, sql } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id: groupId } = await params;
  try {
    const existing = await db.select().from(groupMembers)
      .where(and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, session.user.id))).limit(1);
    if (existing.length > 0) {
      await db.delete(groupMembers).where(eq(groupMembers.id, existing[0].id));
      await db.update(groups).set({ memberCount: sql`${groups.memberCount} - 1` }).where(eq(groups.id, groupId));
      return NextResponse.json({ joined: false });
    }
    await db.insert(groupMembers).values({ id: crypto.randomUUID(), groupId, userId: session.user.id });
    await db.update(groups).set({ memberCount: sql`${groups.memberCount} + 1` }).where(eq(groups.id, groupId));
    return NextResponse.json({ joined: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
