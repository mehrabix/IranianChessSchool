'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { Bot, Loader2, Lightbulb } from 'lucide-react';

interface AICoachPanelProps {
  fen: string;
  pgn: string;
}

export function AICoachPanel({ fen, pgn }: AICoachPanelProps) {
  const t = useTranslations('chess');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleExplain() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fen }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setAnalysis(data.explanation || '');
    } catch {
      setError(t('aiCoachUnavailable'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Bot className="h-4 w-4" />
          {t('aiCoach')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button size="sm" onClick={handleExplain} disabled={loading} className="w-full gap-2">
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Lightbulb className="h-3 w-3" />}
          {loading ? t('analyzing') : t('explainPosition')}
        </Button>
        {error && <p className="text-xs text-muted-foreground">{error}</p>}
        {analysis && (
          <div className="text-xs leading-relaxed p-2 rounded bg-muted/50">
            {analysis}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
