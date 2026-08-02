import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { auth } = await import('@/lib/auth');
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { db, homeworks, eq } = await import('@/lib/db');
  const [hw] = await db.select().from(homeworks).where(eq(homeworks.id, id));
  if (!hw) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (hw.coachId !== session.user.id && hw.studentId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return NextResponse.json(hw);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { auth } = await import('@/lib/auth');
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { db, homeworks, eq } = await import('@/lib/db');
  const [hw] = await db.select().from(homeworks).where(eq(homeworks.id, id));
  if (!hw) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { pgn, studentNotes } = await req.json();

  if (hw.studentId === session.user.id) {
    const [updated] = await db.update(homeworks).set({
      pgn: pgn || hw.pgn,
      studentNotes: studentNotes || hw.studentNotes,
      status: 'SUBMITTED',
      submittedAt: new Date(),
    }).where(eq(homeworks.id, id)).returning();
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: 'Only the student can submit this homework' }, { status: 403 });
}
