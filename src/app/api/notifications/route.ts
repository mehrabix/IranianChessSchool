import { NextRequest, NextResponse } from 'next/server';
import { db, notifications, eq, desc } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const all = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, session.user.id))
      .orderBy(desc(notifications.createdAt))
      .limit(50);
    const unread = all.filter(n => !n.read).length;
    return NextResponse.json({ notifications: all, unread });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id, all } = await req.json();
    if (all) {
      await db.update(notifications).set({ read: true }).where(eq(notifications.userId, session.user.id));
    } else if (id) {
      await db.update(notifications).set({ read: true }).where(eq(notifications.id, id));
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
