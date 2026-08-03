'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError('Failed to send reset email');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <Container size="sm" className="min-h-[60vh] flex items-center justify-center py-20">
        <Card className="w-full text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-7 w-7 text-emerald-600" />
            </div>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>If an account exists for {email}, we sent a reset link. Check your spam folder if you don&apos;t see it.</CardDescription>
            <Button variant="ghost" render={<Link href="/auth/signin" />}><ArrowLeft className="h-4 w-4 me-1" /> Back to sign in</Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container size="sm" className="min-h-[60vh] flex items-center justify-center py-20">
      <Card className="w-full">
        <CardHeader className="space-y-1 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-2">
            <Mail className="h-6 w-6 text-emerald-600" />
          </div>
          <CardTitle className="text-2xl">Forgot password</CardTitle>
          <CardDescription>Enter your email and we&apos;ll send you a reset link</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <Link href="/auth/signin" className="hover:text-foreground transition-colors"><ArrowLeft className="h-3 w-3 inline me-1" />Back to sign in</Link>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
