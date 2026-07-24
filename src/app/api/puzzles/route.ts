import { NextResponse } from 'next/server';
import { db, puzzles, eq, desc, sql, asc } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get('limit')) || 20, 50);
  const offset = Math.max(Number(searchParams.get('offset')) || 0, 0);
  const rating = searchParams.get('rating');
  const theme = searchParams.get('theme');

  let query = db.select().from(puzzles).orderBy(asc(puzzles.rating)).limit(limit).offset(offset);

  if (rating) {
    const [min, max] = rating.split('-').map(Number);
    if (max) {
      query = db.select().from(puzzles).where(sql`${puzzles.rating} >= ${min} AND ${puzzles.rating} <= ${max}`).orderBy(asc(puzzles.rating)).limit(limit).offset(offset) as typeof query;
    }
  }

  const all = await query;
  return NextResponse.json({ puzzles: all });
}
