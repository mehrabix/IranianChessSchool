import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { db, puzzles } = await import('@/lib/db');
  const { fen, solution, rating, themes } = await req.json();
  if (!fen || !solution) return NextResponse.json({ error: 'FEN and solution required' }, { status: 400 });

  const [p] = await db.insert(puzzles).values({
    id: crypto.randomUUID(), fen,
    solution: JSON.stringify(solution),
    rating: rating || 1200,
    themes: themes ? JSON.stringify(themes) : null,
    source: 'CUSTOM', playedCount: 0, successRate: 0,
  }).returning();

  return NextResponse.json(p, { status: 201 });
}
