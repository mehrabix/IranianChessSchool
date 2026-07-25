import { NextRequest, NextResponse } from 'next/server';
import { db, eq, and, desc, sql } from '@/lib/db';
import { auth } from '@/lib/auth';
import { puzzles } from '@/lib/db';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { puzzleId, solved } = await req.json();
    if (!puzzleId || typeof solved !== 'boolean') {
      return NextResponse.json({ error: 'puzzleId and solved are required' }, { status: 400 });
    }

    const existing = await db.select().from(puzzles).where(eq(puzzles.id, puzzleId)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: 'Puzzle not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to record attempt';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
