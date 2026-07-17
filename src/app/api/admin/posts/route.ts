import { NextResponse } from 'next/server';
import { db, posts, eq, desc } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const all = await db.select().from(posts).orderBy(desc(posts.createdAt));
  return NextResponse.json({ posts: all });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { content, image, pgn } = body;

  if (!content) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }

  const id = crypto.randomUUID();
  await db.insert(posts).values({
    id,
    userId: session.user.id,
    content,
    image,
    pgn,
  });

  const post = await db.select().from(posts).where(eq(posts.id, id)).then(r => r[0]);
  return NextResponse.json({ post }, { status: 201 });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { id, content, image, pgn } = body;

  if (!id || !content) {
    return NextResponse.json({ error: 'ID and content are required' }, { status: 400 });
  }

  await db.update(posts).set({ content, image, pgn }).where(eq(posts.id, id));
  const post = await db.select().from(posts).where(eq(posts.id, id)).then(r => r[0]);
  return NextResponse.json({ post });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

  await db.delete(posts).where(eq(posts.id, id));
  return NextResponse.json({ success: true });
}
