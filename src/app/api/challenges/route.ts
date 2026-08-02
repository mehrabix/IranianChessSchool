import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { db, challenges, eq, desc, and, sql } = await import('@/lib/db');

  const now = new Date().getTime();
  const active = await db.select().from(challenges)
    .where(and(eq(challenges.active, true), sql`${challenges.startsAt} <= ${now}`, sql`${challenges.endsAt} >= ${now}`))
    .orderBy(desc(challenges.endsAt));

  return NextResponse.json({ challenges: active });
}

export async function POST(req: NextRequest) {
  const { auth } = await import('@/lib/auth');
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { title, description, type, goal, xpReward, startsAt, endsAt } = await req.json();
  if (!title || !type || !goal || !startsAt || !endsAt) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { db, challenges } = await import('@/lib/db');
  const [ch] = await db.insert(challenges).values({
    id: crypto.randomUUID(),
    title, description: description || null,
    type, goal, xpReward: xpReward || 100,
    startsAt: new Date(startsAt), endsAt: new Date(endsAt),
    active: true,
  }).returning();

  return NextResponse.json(ch, { status: 201 });
}
