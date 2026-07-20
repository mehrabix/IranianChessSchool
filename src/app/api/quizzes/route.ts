import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, quizzes, quizQuestions, eq } from '@/lib/db';

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const lessonId = searchParams.get('lessonId');
  const courseId = searchParams.get('courseId');

  if (lessonId) {
    const all = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.lessonId, lessonId))
      .orderBy(quizzes.order);
    return NextResponse.json({ quizzes: all });
  }

  if (courseId) {
    const qzs = await db.select().from(quizzes).where(eq(quizzes.lessonId, null as any));
    return NextResponse.json({ quizzes: qzs });
  }

  const all = await db.select().from(quizzes);
  return NextResponse.json({ quizzes: all });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const data = await request.json();
  const { title, description, lessonId, passingScore, maxAttempts, timeLimit, order } = data;
  const id = crypto.randomUUID();

  await db.insert(quizzes).values({
    id, title, description, lessonId, passingScore, maxAttempts, timeLimit, order,
  });
  return NextResponse.json({ id }, { status: 201 });
}
