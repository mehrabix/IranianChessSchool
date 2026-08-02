import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) return NextResponse.json({ progress: [] });

  const { db, challengeProgress, eq } = await import('@/lib/db');
  const progress = await db.select().from(challengeProgress).where(eq(challengeProgress.userId, userId));
  return NextResponse.json({ progress });
}
