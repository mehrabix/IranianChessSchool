import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

  const { db, users, verificationTokens, eq } = await import('@/lib/db');

  const [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (!user) return NextResponse.json({ ok: true });

  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + 60 * 60 * 1000);
  await db.insert(verificationTokens).values({ identifier: user.id, token, expires });

  if (process.env.RESEND_API_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Iranian Chess School <noreply@iranianchessschool.com>',
          to: [email],
          subject: 'Reset your password',
          html: `<p>Click <a href="${process.env.AUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}">here</a> to reset your password. This link expires in 1 hour.</p>`,
        }),
      });
    } catch {}
  }

  return NextResponse.json({ ok: true });
}
