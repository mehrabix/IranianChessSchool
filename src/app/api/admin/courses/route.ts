import { NextResponse } from 'next/server';
import { db, courses, eq, desc } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const all = await db
    .select()
    .from(courses)
    .orderBy(desc(courses.createdAt));

  return NextResponse.json({ courses: all });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { title, description, level, image } = body;

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const id = crypto.randomUUID();
  await db.insert(courses).values({
    id,
    title,
    description,
    level: level || 'BEGINNER',
    image,
    published: false,
  });

  const course = await db.select().from(courses).where(eq(courses.id, id)).then(r => r[0]);
  return NextResponse.json({ course }, { status: 201 });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { id, title, description, level, image, published } = body;

  if (!id || !title) {
    return NextResponse.json({ error: 'ID and title are required' }, { status: 400 });
  }

  await db.update(courses)
    .set({ title, description, level, image, published })
    .where(eq(courses.id, id));

  const course = await db.select().from(courses).where(eq(courses.id, id)).then(r => r[0]);
  return NextResponse.json({ course });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  await db.delete(courses).where(eq(courses.id, id));
  return NextResponse.json({ success: true });
}
