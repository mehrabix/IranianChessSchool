'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!token) { setStatus('error'); return; }
    fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(res => setStatus(res.ok ? 'success' : 'error'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <Container size="sm" className="min-h-[60vh] flex items-center justify-center py-20">
      <Card className="w-full text-center">
        <CardContent className="pt-8 pb-8 space-y-4">
          {status === 'loading' && (
            <>
              <Loader2 className="h-10 w-10 animate-spin mx-auto text-emerald-600" />
              <CardTitle>Verifying your email</CardTitle>
              <CardDescription>Please wait a moment...</CardDescription>
            </>
          )}
          {status === 'success' && (
            <>
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-7 w-7 text-emerald-600" />
              </div>
              <CardTitle>Email verified</CardTitle>
              <CardDescription>Your email has been verified. You can now sign in.</CardDescription>
              <Button render={<Link href="/auth/signin" />}>Go to sign in</Button>
            </>
          )}
          {status === 'error' && (
            <>
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                <XCircle className="h-7 w-7 text-red-600" />
              </div>
              <CardTitle>Verification failed</CardTitle>
              <CardDescription>This link is invalid or has expired. Please request a new verification email.</CardDescription>
              <Button render={<Link href="/auth/signin" />}>Back to sign in</Button>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
