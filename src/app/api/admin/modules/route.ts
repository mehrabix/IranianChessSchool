import { NextResponse } from 'next/server';
import { db, modules, lessons, eq, asc } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get('courseId');

  if (!courseId) {
    return NextResponse.json({ error: 'courseId is required' }, { status: 400 });
  }

  const all = await db
    .select()
    .from(modules)
    .where(eq(modules.courseId, courseId))
    .orderBy(asc(modules.order));

  const result = await Promise.all(
    all.map(async (m) => {
      const moduleLessons = await db
        .select()
        .from(lessons)
        .where(eq(lessons.moduleId, m.id))
        .orderBy(asc(lessons.order));
      return { ...m, lessons: moduleLessons };
    })
  );

  return NextResponse.json({ modules: result });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { title, order, courseId } = body;

  if (!title || !courseId) {
    return NextResponse.json({ error: 'Title and courseId are required' }, { status: 400 });
  }

  const id = crypto.randomUUID();
  await db.insert(modules).values({ id, title, order: order || 0, courseId });

  const mod = await db.select().from(modules).where(eq(modules.id, id)).then(r => r[0]);
  return NextResponse.json({ module: mod }, { status: 201 });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { id, title, order } = body;

  if (!id || !title) {
    return NextResponse.json({ error: 'ID and title are required' }, { status: 400 });
  }

  await db.update(modules).set({ title, order }).where(eq(modules.id, id));
  const mod = await db.select().from(modules).where(eq(modules.id, id)).then(r => r[0]);
  return NextResponse.json({ module: mod });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

  await db.delete(modules).where(eq(modules.id, id));
  return NextResponse.json({ success: true });
}
