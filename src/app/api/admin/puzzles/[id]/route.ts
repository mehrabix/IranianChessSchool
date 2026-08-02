import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { db, puzzles, eq } = await import('@/lib/db');
  const { id } = await params;
  await db.delete(puzzles).where(eq(puzzles.id, id));
  return NextResponse.json({ ok: true });
}
