import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { auth } = await import('@/lib/auth');
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = session.user.role as string;
  if (role !== 'COACH' && role !== 'ADMIN') {
    return NextResponse.json({ error: 'Only coaches can review homework' }, { status: 403 });
  }

  const { db, homeworks, eq } = await import('@/lib/db');
  const [hw] = await db.select().from(homeworks).where(eq(homeworks.id, id));
  if (!hw) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (hw.coachId !== session.user.id && role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { coachNotes } = await req.json();
  const [updated] = await db.update(homeworks).set({
    status: 'REVIEWED',
    coachNotes: coachNotes || null,
    reviewedAt: new Date(),
  }).where(eq(homeworks.id, id)).returning();

  return NextResponse.json(updated);
}
