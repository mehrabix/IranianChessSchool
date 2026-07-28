import { NextRequest, NextResponse } from 'next/server';
import { db, tournaments, tournamentPlayers, users as usersTable, eq, desc, sql } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const result = await db.select().from(tournaments).where(eq(tournaments.id, id)).limit(1);
      if (result.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      const tournament = result[0];
      const players = await db
        .select({
          id: tournamentPlayers.id,
          userId: tournamentPlayers.userId,
          score: tournamentPlayers.score,
          joinedAt: tournamentPlayers.joinedAt,
          userName: usersTable.name,
          userImage: usersTable.image,
        })
        .from(tournamentPlayers)
        .leftJoin(usersTable, eq(tournamentPlayers.userId, usersTable.id))
        .where(eq(tournamentPlayers.tournamentId, id));
      return NextResponse.json({ tournament: { ...tournament, playerCount: players.length, players } });
    }

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
