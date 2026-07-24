const unicodePieces: Record<string, string> = {
  K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
  k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟',
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
  const unicode = unicodePieces[piece];
  if (!unicode) return null;

  const isWhite = piece === piece.toUpperCase();

  return (
    <span
      className={className}
      style={{
        fontSize: size,
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: isWhite ? '#fff' : '#111',
        fontFamily: 'Vazirmatn, "Noto Sans Arabic", serif',
        textShadow: isWhite
          ? '0 0 1px #000, 0 0 1px #000'
          : '0 0 1px #fff, 0 0 1px #fff',
        userSelect: 'none',
      }}
    >
      {unicode}
    </span>
  );
}