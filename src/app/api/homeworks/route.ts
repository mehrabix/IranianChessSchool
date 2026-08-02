import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { auth } = await import('@/lib/auth');
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { db, homeworks, eq, desc } = await import('@/lib/db');
  const { searchParams } = req.nextUrl;
  const role = session.user.role as string;

  if (role === 'COACH' || role === 'ADMIN') {
    const studentId = searchParams.get('studentId');
    if (studentId) {
      const items = await db.select().from(homeworks).where(eq(homeworks.studentId, studentId)).orderBy(desc(homeworks.assignedAt));
      return NextResponse.json({ homeworks: items });
    }
    const items = await db.select().from(homeworks).orderBy(desc(homeworks.assignedAt));
    return NextResponse.json({ homeworks: items });
  }

  const items = await db.select().from(homeworks).where(eq(homeworks.studentId, session.user.id)).orderBy(desc(homeworks.assignedAt));
  return NextResponse.json({ homeworks: items });
}

export async function POST(req: NextRequest) {
  const { auth } = await import('@/lib/auth');
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const role = session.user.role as string;
  if (role !== 'COACH' && role !== 'ADMIN') {
    return NextResponse.json({ error: 'Only coaches can assign homework' }, { status: 403 });
  }

  try {
    const { studentId, lessonId, courseId, title, description } = await req.json();
    if (!studentId || !title) {
      return NextResponse.json({ error: 'studentId and title are required' }, { status: 400 });
    }

    const { db, homeworks } = await import('@/lib/db');

    const [hw] = await db.insert(homeworks).values({
      id: crypto.randomUUID(),
      coachId: session.user.id,
      studentId,
      lessonId: lessonId || null,
      courseId: courseId || null,
      title,
      description: description || null,
      status: 'PENDING',
    }).returning();

    return NextResponse.json(hw, { status: 201 });
  } catch (e) {
    console.error('Homework create error:', e);
    return NextResponse.json({ error: 'Failed to create homework' }, { status: 500 });
  }
}
