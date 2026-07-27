import { NextResponse } from 'next/server';
import { db, users } from '@/lib/db';
import { lt } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const yesterday = Date.now() - 86400000;

    const result = await db
      .update(users)
      .set({ streak: 0 })
      .where(lt(users.lastActive, new Date(yesterday)));

    return NextResponse.json({ success: true, reset: (result as any).rowsAffected ?? 0 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
