'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface CheckoutButtonProps {
  plan: string;
  provider?: string;
  variant?: 'default' | 'outline';
  className?: string;
  children: React.ReactNode;
}

export function CheckoutButton({ plan, provider, variant = 'default', className, children }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, provider }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        router.push('/auth/signin');
      }
    } catch {
      router.push('/auth/signin');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      className={`h-11 gap-2 ${className || 'w-full'}`}
      variant={variant}
      onClick={handleCheckout}
      disabled={loading}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
    </Button>
  );
}
