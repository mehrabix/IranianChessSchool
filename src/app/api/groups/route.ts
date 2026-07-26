import { NextRequest, NextResponse } from 'next/server';
import { db, groups, groupMembers, eq, desc, sql } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const all = await db.select().from(groups).orderBy(desc(groups.memberCount));
    return NextResponse.json({ groups: all });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { name, description, category } = await req.json();
    if (!name?.trim()) return NextResponse.json({ error: 'Name required' }, { status: 400 });
    const id = crypto.randomUUID();
    const group = await db.insert(groups).values({ id, name: name.trim(), description, category, createdBy: session.user.id }).returning();
    await db.insert(groupMembers).values({ id: crypto.randomUUID(), groupId: id, userId: session.user.id, role: 'ADMIN' });
    return NextResponse.json({ group: group[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
