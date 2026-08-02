import { NextRequest, NextResponse } from 'next/server';
import { db, users as usersTable, eq, like, desc } from '@/lib/db';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const all = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt));
  return NextResponse.json({ users: all.map(u => ({ ...u, passwordHash: undefined })) });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { userId, role, banned } = await req.json();
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  const updates: Record<string, unknown> = {};
  if (role) updates.role = role;
  if (banned !== undefined) updates.subscriptionStatus = banned ? 'BANNED' : null;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
  }

  const [updated] = await db.update(usersTable).set(updates).where(eq(usersTable.id, userId)).returning();
  return NextResponse.json({ user: { ...updated, passwordHash: undefined } });
}
