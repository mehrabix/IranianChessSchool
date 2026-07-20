import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, quizzes, quizQuestions, eq, asc } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = await params;
  const quiz = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).then(r => r[0]);
  if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });

  const questions = await db
    .select()
    .from(quizQuestions)
    .where(eq(quizQuestions.quizId, quizId))
    .orderBy(asc(quizQuestions.order));

  return NextResponse.json({ quiz, questions });
}

export async function PUT(request: Request, { params }: { params: Promise<{ quizId: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const { quizId } = await params;
  const data = await request.json();
  await db.update(quizzes).set(data).where(eq(quizzes.id, quizId));
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ quizId: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const { quizId } = await params;
  await db.delete(quizzes).where(eq(quizzes.id, quizId));
  return NextResponse.json({ success: true });
}
