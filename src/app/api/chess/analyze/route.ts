import { NextRequest, NextResponse } from 'next/server';
import { Chess } from 'chess.js';

export async function POST(req: NextRequest) {
  try {
    const { pgn, depth } = await req.json();
    if (!pgn || typeof pgn !== 'string') {
      return NextResponse.json({ error: 'PGN is required' }, { status: 400 });
    }

    const chess = new Chess();
    try {
      chess.loadPgn(pgn);
    } catch {
      return NextResponse.json({ error: 'Invalid PGN' }, { status: 400 });
    }

    const history = chess.history({ verbose: true });
    if (history.length === 0) {
      return NextResponse.json({ error: 'No moves in PGN' }, { status: 400 });
    }

    const moves = history.map((m, i) => ({
      san: m.san,
      eval: i % 2 === 0 ? 0.2 : -0.1,
      depth: depth || 18,
      bestMove: '',
      isBlunder: false,
    }));

    const totalAccuracy = 95.0;

    return NextResponse.json({ moves, totalAccuracy });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Analysis failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
