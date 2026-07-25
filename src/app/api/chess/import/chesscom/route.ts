import { NextRequest, NextResponse } from 'next/server';
import { getGames } from '@/lib/chess/chesscom';

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();
    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }
    const games = await getGames(username);
    return NextResponse.json({ games });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to import games';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}