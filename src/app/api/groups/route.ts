import { NextRequest, NextResponse } from 'next/server';
import { db, groups, groupMembers, users as usersTable, eq, desc, sql } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const result = await db.select().from(groups).where(eq(groups.id, id)).limit(1);
      if (result.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      const group = result[0];
      const members = await db
        .select({
          id: groupMembers.id,
          userId: groupMembers.userId,
          role: groupMembers.role,
          joinedAt: groupMembers.joinedAt,
          userName: usersTable.name,
          userImage: usersTable.image,
        })
        .from(groupMembers)
        .leftJoin(usersTable, eq(groupMembers.userId, usersTable.id))
        .where(eq(groupMembers.groupId, id));
      return NextResponse.json({ group: { ...group, members } });
    }

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
