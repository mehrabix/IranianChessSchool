'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!token) { setError('Invalid reset link'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <Container size="sm" className="min-h-[60vh] flex items-center justify-center py-20">
        <Card className="w-full text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <CardTitle>Invalid link</CardTitle>
            <CardDescription>This reset link is missing or has already been used.</CardDescription>
            <Button variant="ghost" render={<Link href="/auth/forgot-password" />}>Request a new link</Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (success) {
    return (
      <Container size="sm" className="min-h-[60vh] flex items-center justify-center py-20">
        <Card className="w-full text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-7 w-7 text-emerald-600" />
            </div>
            <CardTitle>Password reset</CardTitle>
            <CardDescription>Your password has been updated. You can now sign in with your new password.</CardDescription>
            <Button render={<Link href="/auth/signin" />}>Go to sign in</Button>
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
            <Lock className="h-6 w-6 text-emerald-600" />
          </div>
          <CardTitle className="text-2xl">Set new password</CardTitle>
          <CardDescription>Choose a new password for your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input id="confirm" name="confirm" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset password'}
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
