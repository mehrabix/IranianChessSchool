import { NextRequest, NextResponse } from 'next/server';
import { explainPosition } from '@/lib/ai-coach';

export async function POST(req: NextRequest) {
  try {
    const { fen } = await req.json();
    if (!fen) return NextResponse.json({ error: 'FEN required' }, { status: 400 });

    const explanation = await explainPosition(fen);
    return NextResponse.json({ explanation });
  } catch {
    return NextResponse.json({ error: 'AI unavailable' }, { status: 500 });
  }
}
