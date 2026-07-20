import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, quizQuestions, eq, asc } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = await params;
  const questions = await db
    .select()
    .from(quizQuestions)
    .where(eq(quizQuestions.quizId, quizId))
    .orderBy(asc(quizQuestions.order));
  return NextResponse.json({ questions });
}

export async function POST(request: Request, { params }: { params: Promise<{ quizId: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const { quizId } = await params;
  const data = await request.json();
  const { questionText, options, correctIndices, type, order, explanation, points } = data;
  const id = crypto.randomUUID();
  await db.insert(quizQuestions).values({
    id, quizId, questionText, options: JSON.stringify(options), correctIndices: JSON.stringify(correctIndices), type, order, explanation, points,
  });
  return NextResponse.json({ id }, { status: 201 });
}
