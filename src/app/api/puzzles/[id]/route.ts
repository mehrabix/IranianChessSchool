import { NextResponse } from 'next/server';
import { db, puzzles, eq } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const puzzle = await db.select().from(puzzles).where(eq(puzzles.id, id)).then(r => r[0]);
  if (!puzzle) {
    return NextResponse.json({ error: 'Puzzle not found' }, { status: 404 });
  }
  return NextResponse.json({ puzzle });
}
