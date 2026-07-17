import { NextResponse } from 'next/server';
import { db, progress, eq, and, desc } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const lessonId = searchParams.get('lessonId');

  if (lessonId) {
    const record = await db
      .select()
      .from(progress)
      .where(and(eq(progress.userId, session.user.id), eq(progress.lessonId, lessonId)))
      .then(r => r[0]);
    return NextResponse.json({ progress: record || null });
  }

  const all = await db
    .select()
    .from(progress)
    .where(eq(progress.userId, session.user.id))
    .orderBy(desc(progress.completedAt));
  return NextResponse.json({ progress: all });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { lessonId, completed, score, timeSpent } = body;

  if (!lessonId) {
    return NextResponse.json({ error: 'lessonId is required' }, { status: 400 });
  }

  const existing = await db
    .select()
    .from(progress)
    .where(and(eq(progress.userId, session.user.id), eq(progress.lessonId, lessonId)))
    .then(r => r[0]);

  if (existing) {
    await db.update(progress)
      .set({ completed, score, timeSpent, completedAt: completed ? new Date() : null })
      .where(eq(progress.id, existing.id));
    const updated = await db.select().from(progress).where(eq(progress.id, existing.id)).then(r => r[0]);
    return NextResponse.json({ progress: updated });
  }

  const id = crypto.randomUUID();
  await db.insert(progress).values({
    id,
    userId: session.user.id,
    lessonId,
    completed: completed || false,
    score,
    timeSpent,
    attempts: 1,
    completedAt: completed ? new Date() : null,
  });

  const record = await db.select().from(progress).where(eq(progress.id, id)).then(r => r[0]);
  return NextResponse.json({ progress: record }, { status: 201 });
}
