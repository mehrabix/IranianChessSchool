import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, quizzes, quizQuestions, quizAttempts, quizAnswers, eq, asc, and } from '@/lib/db';

export async function POST(request: Request, { params }: { params: Promise<{ quizId: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const { quizId } = await params;

  const quiz = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).then(r => r[0]);
  if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });

  const existingAttempts = await db
    .select()
    .from(quizAttempts)
    .where(and(
      eq(quizAttempts.userId, session.user.id),
      eq(quizAttempts.quizId, quizId)
    ));

  if (quiz.maxAttempts && existingAttempts.length >= quiz.maxAttempts) {
    return NextResponse.json({ error: 'Max attempts reached' }, { status: 403 });
  }

  const id = crypto.randomUUID();
  await db.insert(quizAttempts).values({ id, userId: session.user.id, quizId });
  return NextResponse.json({ attemptId: id }, { status: 201 });
}

export async function GET(request: Request, { params }: { params: Promise<{ quizId: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const { quizId } = await params;

  const attempts = await db
    .select()
    .from(quizAttempts)
    .where(and(
      eq(quizAttempts.userId, session.user.id),
      eq(quizAttempts.quizId, quizId)
    ))
    .orderBy(asc(quizAttempts.startedAt));

  return NextResponse.json({ attempts });
}
