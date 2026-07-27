import { NextResponse } from 'next/server';
import { db, puzzles } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await fetch('https://lichess.org/api/puzzle/daily');
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch puzzle from Lichess' }, { status: 502 });
    }

    const data = await response.json();
    const puzzle = data.puzzle;

    const [inserted] = await db.insert(puzzles).values({
      id: puzzle.id,
      fen: puzzle.fen,
      solution: puzzle.moves.join(' '),
      rating: puzzle.rating,
      themes: JSON.stringify(puzzle.themes),
      source: 'LICHESS',
    }).returning();

    return NextResponse.json({ success: true, puzzle: { id: inserted.id } });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
