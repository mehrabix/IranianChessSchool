import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { auth } = await import('@/lib/auth');
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { db, challenges, challengeProgress, users, eq, and, sql } = await import('@/lib/db');

  const [challenge] = await db.select().from(challenges).where(eq(challenges.id, id));
  if (!challenge) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const [existing] = await db.select().from(challengeProgress)
    .where(and(eq(challengeProgress.challengeId, id), eq(challengeProgress.userId, session.user.id)));

  if (existing) {
    const newProgress = Math.min((existing.progress ?? 0) + 1, challenge.goal);
    const completed = newProgress >= challenge.goal && !existing.completed;
    const [updated] = await db.update(challengeProgress).set({
      progress: newProgress,
      completed: completed ? true : existing.completed,
      completedAt: completed ? new Date() : existing.completedAt,
    }).where(eq(challengeProgress.id, existing.id)).returning();

    if (completed && (challenge.xpReward ?? 0) > 0) {
      await db.update(users).set({ xp: sql`${users.xp} + ${challenge.xpReward}` }).where(eq(users.id, session.user.id));
    }

    return NextResponse.json(updated);
  }

  const [created] = await db.insert(challengeProgress).values({
    id: crypto.randomUUID(),
    challengeId: id,
    userId: session.user.id,
    progress: 1,
  }).returning();

  return NextResponse.json(created, { status: 201 });
}
