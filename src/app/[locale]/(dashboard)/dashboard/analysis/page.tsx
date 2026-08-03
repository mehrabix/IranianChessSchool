'use client';

import { useState, useCallback, useRef } from 'react';
import { Chess } from 'chess.js';
import { ChessBoard } from '@/components/chess/ChessBoard';
import { EngineEval } from '@/components/chess/EngineEval';
import { GameAnalysisPanel } from '@/components/chess/GameAnalysisPanel';
import { GameImportPanel } from '@/components/chess/GameImportPanel';
import { OpeningExplorer } from '@/components/chess/OpeningExplorer';
import { AICoachPanel } from '@/components/chess/AICoachPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from 'next-intl';
import {
  ChevronLeft, ChevronRight, SkipBack, SkipForward,
  Upload, Download, FlipHorizontal, FileUp,
} from 'lucide-react';

export default function AnalysisPage() {
  const t = useTranslations('dashboard');
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [history, setHistory] = useState<string[]>([]);
  const [currentMove, setCurrentMove] = useState(-1);
  const [pgnInput, setPgnInput] = useState('');
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [notify, setNotify] = useState<string | null>(null);

  function cloneGame(): Chess {
    const g = new Chess();
    g.loadPgn(game.pgn());
    return g;
  }

  function makeMove(from: string, to: string): boolean {
    try {
      const g = cloneGame();
      g.move({ from, to });
      setGame(g);
      setFen(g.fen());
      setHistory(g.history());
      setCurrentMove(g.history().length - 1);
      return true;
    } catch {
      return false;
    }
  }

  function goToMove(index: number) {
    const g = new Chess();
    for (let i = 0; i <= index; i++) {
      g.move(history[i]);
    }
    setGame(g);
    setFen(g.fen());
    setCurrentMove(index);
  }

  function resetGame() {
    const g = new Chess();
    setGame(g);
    setFen(g.fen());
    setHistory([]);
    setCurrentMove(-1);
  }

  function flipBoard() {
    setBoardOrientation(prev => prev === 'white' ? 'black' : 'white');
  }

  function exportPgn() {
    const pgn = game.pgn();
    navigator.clipboard.writeText(pgn);
    setNotify(t('pgnCopied') || 'PGN copied to clipboard!');
    setTimeout(() => setNotify(null), 2000);
  }

  function importPgn() {
    try {
      const g = new Chess();
      g.loadPgn(pgnInput);
      setGame(g);
      setFen(g.fen());
      setHistory(g.history());
      setCurrentMove(g.history().length - 1);
    } catch {
      setNotify(t('invalidPgn') || 'Invalid PGN');
      setTimeout(() => setNotify(null), 2000);
    }
  }

  function handleGameImport(pgn: string) {
    try {
      const g = new Chess();
      g.loadPgn(pgn);
      setGame(g);
      setFen(g.fen());
      setHistory(g.history());
      setCurrentMove(g.history().length - 1);
      setNotify(null);
    } catch {
      setNotify(t('invalidPgn') || 'Invalid PGN');
      setTimeout(() => setNotify(null), 2000);
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        try {
          const g = new Chess();
          g.loadPgn(text);
          setGame(g);
          setFen(g.fen());
          setHistory(g.history());
          setCurrentMove(g.history().length - 1);
        } catch {
          setNotify(t('invalidPgn') || 'Invalid PGN file');
          setTimeout(() => setNotify(null), 2000);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <section className="py-8">
      <Container size="lg">
        <h1 className="text-3xl font-bold mb-6">{t('analysis')}</h1>

        {notify && (
          <div className="fixed top-4 right-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg text-sm">
            {notify}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-4 min-w-0">
            <Card>
              <CardContent className="pt-6 px-3 sm:px-6">
                <div className="flex flex-col items-center gap-4">
                  <ChessBoard
                    game={game}
                    onMove={makeMove}
                    onReset={resetGame}
                  />
                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
                    <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={() => goToMove(history.length - 1)} disabled={currentMove >= history.length - 1}>
                      <SkipForward className="h-4 w-4 rtl:rotate-180" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={() => goToMove(currentMove + 1)} disabled={currentMove >= history.length - 1}>
                      <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                    </Button>
                    <span className="text-sm text-muted-foreground min-w-[60px] text-center">
                      {currentMove < 0 ? '-' : `${currentMove + 1}/${history.length}`}
                    </span>
                    <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={() => goToMove(currentMove - 1)} disabled={currentMove < 0}>
                      <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={() => goToMove(0)} disabled={currentMove < 0}>
                      <SkipBack className="h-4 w-4 rtl:rotate-180" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={flipBoard}>
                      <FlipHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">{t('moves')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs font-mono max-h-[200px] overflow-y-auto">
                  {history.map((move, i) => (
                    <button
                      key={i}
                      onClick={() => goToMove(i)}
                      className={`inline-block px-1 py-0.5 rounded cursor-pointer hover:bg-accent transition-colors ${
                        i === currentMove ? 'bg-primary/20 text-primary font-bold' : ''
                      }`}
                    >
                      {i % 2 === 0 ? `${Math.floor(i / 2) + 1}. ` : ''}
                      {move}{' '}
                    </button>
                  ))}
                  {history.length === 0 && (
                    <p className="text-muted-foreground">{t('makeFirstMove') || 'Make a move to start'}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <EngineEval fen={fen} />

            <GameAnalysisPanel pgn={game.pgn()} onMoveClick={goToMove} />

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">{t('importExport')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>{t('importPgn')}</Label>
                  <Textarea
                    ref={textareaRef}
                    value={pgnInput}
                    onChange={e => setPgnInput(e.target.value)}
                    placeholder={t('pgnPlaceholder') || 'Paste PGN here...'}
                    className="min-h-[80px] text-xs font-mono"
                  />
                  <Button size="sm" className="gap-2 w-full" onClick={importPgn}>
                    <Upload className="h-3 w-3" /> {t('import')}
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>{t('uploadPgnFile') || 'Upload PGN File'}</Label>
                  <label className="flex items-center justify-center gap-2 w-full h-9 rounded-md border border-dashed text-xs text-muted-foreground cursor-pointer hover:bg-accent transition-colors">
                    <FileUp className="h-3 w-3" />
                    {t('chooseFile') || 'Choose .pgn file'}
                    <input type="file" accept=".pgn" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>
                <Button size="sm" variant="outline" className="gap-2 w-full" onClick={exportPgn}>
                  <Download className="h-3 w-3" /> {t('exportPgn')}
                </Button>
              </CardContent>
            </Card>

            <GameImportPanel onGameImport={handleGameImport} />

            <OpeningExplorer fen={fen} onMoveClick={(move) => {
              const g = cloneGame();
              const result = g.move(move);
              if (result) {
                setGame(g);
                setFen(g.fen());
                setHistory(g.history());
                setCurrentMove(g.history().length - 1);
              }
            }} />

            <AICoachPanel fen={fen} pgn={game.pgn()} />

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">{t('fen')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs font-mono break-all text-muted-foreground select-all">{fen}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
}
