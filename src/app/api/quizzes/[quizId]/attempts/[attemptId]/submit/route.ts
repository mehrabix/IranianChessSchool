import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, quizAttempts, quizQuestions, quizAnswers, quizzes, eq, and, asc } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ quizId: string; attemptId: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const { quizId, attemptId } = await params;

  const attempt = await db
    .select()
    .from(quizAttempts)
    .where(and(eq(quizAttempts.id, attemptId), eq(quizAttempts.userId, session.user.id)))
    .then(r => r[0]);

  if (!attempt) return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
  if (attempt.completedAt) return NextResponse.json({ error: 'Already submitted' }, { status: 400 });

  const quiz = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).then(r => r[0]);
  const questions = await db
    .select()
    .from(quizQuestions)
    .where(eq(quizQuestions.quizId, quizId))
    .orderBy(asc(quizQuestions.order));

  const data = await request.json();
  const { answers } = data; // Array of { questionId, selectedIndices?, textAnswer? }

  let totalScore = 0;
  const totalPoints = questions.reduce((sum, q) => sum + (q.points || 10), 0);

  for (const answer of answers) {
    const question = questions.find(q => q.id === answer.questionId);
    if (!question) continue;

    const correctIndices: number[] = JSON.parse(question.correctIndices);
    const selected: number[] = answer.selectedIndices ? JSON.parse(answer.selectedIndices) : [];
    const isCorrect = JSON.stringify([...selected].sort()) === JSON.stringify([...correctIndices].sort());
    const pointsEarned = isCorrect ? (question.points || 10) : 0;
    totalScore += pointsEarned;

    await db.insert(quizAnswers).values({
      id: crypto.randomUUID(),
      attemptId,
      questionId: answer.questionId,
      selectedIndices: JSON.stringify(selected),
      textAnswer: answer.textAnswer,
      isCorrect,
      pointsEarned,
    });
  }

  const percentage = totalPoints > 0 ? Math.round((totalScore / totalPoints) * 100) : 0;
  const passed = percentage >= (quiz.passingScore || 70);

  await db.update(quizAttempts).set({
    score: totalScore,
    totalPoints,
    percentage,
    passed,
    completedAt: new Date(),
  }).where(eq(quizAttempts.id, attemptId));

  return NextResponse.json({ score: totalScore, totalPoints, percentage, passed });
}
