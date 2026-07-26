import { NextRequest, NextResponse } from 'next/server';
import { db, tournaments, tournamentPlayers, eq, and, sql } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id: tId } = await params;
  try {
    const [t] = await db.select().from(tournaments).where(eq(tournaments.id, tId)).limit(1);
    if (!t) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const players = await db.select({ count: sql<number>`count(*)` }).from(tournamentPlayers).where(eq(tournamentPlayers.tournamentId, tId));
    if ((players[0]?.count || 0) >= (t.maxPlayers || 16)) return NextResponse.json({ error: 'Tournament full' }, { status: 400 });
    const existing = await db.select().from(tournamentPlayers).where(and(eq(tournamentPlayers.tournamentId, tId), eq(tournamentPlayers.userId, session.user.id))).limit(1);
    if (existing.length > 0) {
      await db.delete(tournamentPlayers).where(eq(tournamentPlayers.id, existing[0].id));
      return NextResponse.json({ joined: false });
    }
    await db.insert(tournamentPlayers).values({ id: crypto.randomUUID(), tournamentId: tId, userId: session.user.id });
    return NextResponse.json({ joined: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
