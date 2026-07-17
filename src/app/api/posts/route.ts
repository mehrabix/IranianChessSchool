import { NextResponse } from 'next/server';
import { db, posts, eq, desc } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const post = await db.select().from(posts).where(eq(posts.id, id)).then(r => r[0]);
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ post });
  }

  const all = await db.select().from(posts).orderBy(desc(posts.createdAt));
  return NextResponse.json({ posts: all });
}
