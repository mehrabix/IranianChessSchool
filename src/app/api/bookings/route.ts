import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  const { auth } = await import('@/lib/auth');
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { db, bookings, eq, desc } = await import('@/lib/db');
  const role = session.user.role as string;
  if (role === 'COACH' || role === 'ADMIN') {
    const all = await db.select().from(bookings).orderBy(desc(bookings.startTime));
    return NextResponse.json({ bookings: all });
  }
  const mine = await db.select().from(bookings).where(eq(bookings.studentId, session.user.id)).orderBy(desc(bookings.startTime));
  return NextResponse.json({ bookings: mine });
}

export async function POST(req: NextRequest) {
  const { auth } = await import('@/lib/auth');
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { coachId, startTime, endTime, notes } = await req.json();
  if (!coachId || !startTime || !endTime) return NextResponse.json({ error: 'coachId, startTime, endTime required' }, { status: 400 });

  const { db, bookings } = await import('@/lib/db');
  const [b] = await db.insert(bookings).values({
    id: crypto.randomUUID(), coachId, studentId: session.user.id,
    startTime: new Date(startTime), endTime: new Date(endTime),
    notes: notes || null, status: 'PENDING', price: 0,
  }).returning();

  return NextResponse.json(b, { status: 201 });
}
