import { NextRequest, NextResponse } from 'next/server';
import { db, posts, eq } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  try {
    const existing = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
    if (existing.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (existing[0].userId !== session.user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { content, image, pgn } = await req.json();
    if (!content?.trim()) return NextResponse.json({ error: 'Content is required' }, { status: 400 });

    const [updated] = await db
      .update(posts)
      .set({ content: content.trim(), image: image || null, pgn: pgn || null })
      .where(eq(posts.id, id))
      .returning();

    return NextResponse.json({ post: updated });
  } catch {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  try {
    const existing = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
    if (existing.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (existing[0].userId !== session.user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await db.delete(posts).where(eq(posts.id, id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
