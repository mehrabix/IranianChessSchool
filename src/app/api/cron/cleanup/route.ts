import { NextResponse } from 'next/server';
import { db, verificationTokens, sessions } from '@/lib/db';
import { lt } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();

    const deletedTokens = await db
      .delete(verificationTokens)
      .where(lt(verificationTokens.expires, now));

    const deletedSessions = await db
      .delete(sessions)
      .where(lt(sessions.expires, now));

    return NextResponse.json({
      success: true,
      deletedTokens: (deletedTokens as any).rowsAffected ?? 0,
      deletedSessions: (deletedSessions as any).rowsAffected ?? 0,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
