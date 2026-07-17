import { NextResponse } from 'next/server';
import { db, lessons, eq, asc } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const moduleId = searchParams.get('moduleId');

  if (!moduleId) {
    return NextResponse.json({ error: 'moduleId is required' }, { status: 400 });
  }

  const all = await db
    .select()
    .from(lessons)
    .where(eq(lessons.moduleId, moduleId))
    .orderBy(asc(lessons.order));

  return NextResponse.json({ lessons: all });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { title, content, videoUrl, order, moduleId, courseId, type, duration } = body;

  if (!title || !moduleId || !courseId) {
    return NextResponse.json({ error: 'Title, moduleId, and courseId are required' }, { status: 400 });
  }

  const id = crypto.randomUUID();
  await db.insert(lessons).values({
    id, title, content, videoUrl,
    order: order || 0,
    moduleId, courseId,
    type: type || 'TEXT',
    duration,
  });

  const lesson = await db.select().from(lessons).where(eq(lessons.id, id)).then(r => r[0]);
  return NextResponse.json({ lesson }, { status: 201 });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { id, title, content, videoUrl, order, type, duration } = body;

  if (!id || !title) {
    return NextResponse.json({ error: 'ID and title are required' }, { status: 400 });
  }

  await db.update(lessons).set({ title, content, videoUrl, order, type, duration }).where(eq(lessons.id, id));
  const lesson = await db.select().from(lessons).where(eq(lessons.id, id)).then(r => r[0]);
  return NextResponse.json({ lesson });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

  await db.delete(lessons).where(eq(lessons.id, id));
  return NextResponse.json({ success: true });
}
