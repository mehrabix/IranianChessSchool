import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();
  if (!token || !password) return NextResponse.json({ error: 'Token and password required' }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: 'Password too short' }, { status: 400 });

  const { db, users, verificationTokens, eq, and, sql } = await import('@/lib/db');

  const [vt] = await db.select().from(verificationTokens)
    .where(and(eq(verificationTokens.token, token), sql`${verificationTokens.expires} > ${Date.now()}`))
    .limit(1);

  if (!vt) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });

  const passwordHash = await hash(password, 10);
  await db.update(users).set({ passwordHash }).where(eq(users.id, vt.identifier));
  await db.delete(verificationTokens).where(eq(verificationTokens.token, token));

  return NextResponse.json({ ok: true });
}
