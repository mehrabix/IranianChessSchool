import { NextResponse } from 'next/server';
import { db, puzzles, sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const dayOfYear = Math.floor((Date.now() - Date.UTC(new Date().getFullYear(), 0, 0)) / 86400000);
  const all = await db.select().from(puzzles);
  const index = dayOfYear % all.length;
  const puzzle = all[index];
  if (!puzzle) {
    return NextResponse.json({ error: 'No puzzles available' }, { status: 404 });
  }
  return NextResponse.json({ puzzle });
}
