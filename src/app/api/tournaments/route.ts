import { NextRequest, NextResponse } from 'next/server';
import { db, tournaments, tournamentPlayers, eq, desc, sql } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const all = await db.select().from(tournaments).orderBy(desc(tournaments.createdAt));
    const populated = await Promise.all(all.map(async (t) => {
      const players = await db.select().from(tournamentPlayers).where(eq(tournamentPlayers.tournamentId, t.id));
      return { ...t, playerCount: players.length, players };
    }));
    return NextResponse.json({ tournaments: populated });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { name, description, type, maxPlayers } = await req.json();
    if (!name?.trim()) return NextResponse.json({ error: 'Name required' }, { status: 400 });
    const t = await db.insert(tournaments).values({
      id: crypto.randomUUID(), name: name.trim(), description, type, maxPlayers: maxPlayers || 16, createdBy: session.user.id,
    }).returning();
    return NextResponse.json({ tournament: t[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
