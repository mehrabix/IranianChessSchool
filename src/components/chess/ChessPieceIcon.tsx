'use client';

import Image from 'next/image';

const pieceFile: Record<string, string> = {
  K: 'wK', Q: 'wQ', R: 'wR', B: 'wB', N: 'wN', P: 'wP',
  k: 'bK', q: 'bQ', r: 'bR', b: 'bB', n: 'bN', p: 'bP',
};

export function ChessPieceIcon({
  piece,
  size = 24,
  className,
}: {
  piece: string;
  size?: number;
  className?: string;
}) {
  const file = pieceFile[piece];
  if (!file) return null;

  return (
    <Image
      src={`/pieces/${file}.svg`}
      alt={piece}
      width={size}
      height={size}
      className={className}
      draggable={false}
      style={{ userSelect: 'none' }}
    />
  );
}
