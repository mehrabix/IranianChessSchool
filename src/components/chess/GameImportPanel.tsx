'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';
import { Loader2, Download, Globe } from 'lucide-react';
import type { LichessGame } from '@/lib/chess/lichess';

interface GameImportPanelProps {
  onGameImport: (pgn: string) => void;
}

export function GameImportPanel({ onGameImport }: GameImportPanelProps) {
  const t = useTranslations('dashboard');
  const [username, setUsername] = useState('');
  const [platform, setPlatform] = useState<'chesscom' | 'lichess'>('chesscom');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [games, setGames] = useState<{ pgn: string; url?: string; id?: string }[]>([]);
  const [showGames, setShowGames] = useState(false);

  async function handleImport() {
    if (!username.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const endpoint = platform === 'chesscom'
        ? '/api/chess/import/chesscom'
        : '/api/chess/import/lichess';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Import failed');
      }
      const data = await res.json();
      setGames(data.games || []);
      setShowGames(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Import failed');
    } finally {
      setLoading(false);
    }
  }

  function loadGame(pgn: string) {
    onGameImport(pgn);
    setShowGames(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Globe className="h-4 w-4" />
          {t('importGames') || 'Import Games'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Button
            variant={platform === 'chesscom' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPlatform('chesscom')}
            className="flex-1"
          >
            Chess.com
          </Button>
          <Button
            variant={platform === 'lichess' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPlatform('lichess')}
            className="flex-1"
          >
            Lichess
          </Button>
        </div>
        <div className="space-y-2">
          <Label>{t('username') || 'Username'}</Label>
          <Input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder={platform === 'chesscom' ? 'Chess.com username' : 'Lichess username'}
            onKeyDown={e => e.key === 'Enter' && handleImport()}
          />
        </div>
        <Button
          size="sm"
          className="w-full gap-2"
          onClick={handleImport}
          disabled={loading || !username.trim()}
        >
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
          {loading ? (t('importing') || 'Importing...') : (t('importGames') || 'Import Games')}
        </Button>

        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}

        {showGames && games.length > 0 && (
          <div className="space-y-1 max-h-[200px] overflow-y-auto">
            <p className="text-xs text-muted-foreground">{games.length} game{games.length !== 1 ? 's' : ''} found</p>
            {games.map((game, i) => (
              <button
                key={i}
                onClick={() => loadGame(game.pgn)}
                className="w-full text-left text-xs p-2 rounded border hover:bg-accent transition-colors font-mono truncate"
              >
                {game.pgn.slice(0, 80)}...
              </button>
            ))}
          </div>
        )}

        {showGames && games.length === 0 && (
          <p className="text-xs text-muted-foreground">{t('noGamesFound') || 'No games found.'}</p>
        )}
      </CardContent>
    </Card>
  );
}