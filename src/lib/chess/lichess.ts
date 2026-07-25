const LICHESS_API = 'https://lichess.org/api';

export interface LichessUser {
  id: string;
  username: string;
  perfs: {
    blitz: { rating: number; games: number };
    rapid: { rating: number; games: number };
    bullet: { rating: number; games: number };
    puzzle: { rating: number; games: number };
  };
  profile?: { firstName?: string; lastName?: string; image?: string };
}

export interface LichessGame {
  id: string;
  pgn: string;
  speed: string;
  rated: boolean;
  createdAt: number;
  players: {
    white: { user?: { name: string; rating: number }; rating: number };
    black: { user?: { name: string; rating: number }; rating: number };
  };
}

export interface RatingPoint {
  name: string;
  points: { date: number; rating: number }[];
}

export async function getProfile(username: string): Promise<LichessUser> {
  const res = await fetch(`${LICHESS_API}/user/${username}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Lichess user not found: ${username}`);
  return res.json();
}

export async function getRatingHistory(username: string): Promise<RatingPoint[]> {
  const res = await fetch(`${LICHESS_API}/user/${username}/rating-history`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Lichess rating history not found: ${username}`);
  return res.json();
}

export async function getGames(
  username: string,
  max = 50,
): Promise<LichessGame[]> {
  const res = await fetch(
    `${LICHESS_API}/games/user/${username}?max=${max}&pgnInJson=true`,
    { headers: { Accept: 'application/x-ndjson' } },
  );
  if (!res.ok) throw new Error(`Lichess games not found for ${username}`);
  const text = await res.text();
  return text
    .trim()
    .split('\n')
    .filter(Boolean)
    .map(line => JSON.parse(line));
}

export async function getDailyPuzzle(): Promise<{
  id: string;
  fen: string;
  solution: string[];
  rating: number;
  themes: string[];
}> {
  const res = await fetch(`${LICHESS_API}/puzzle/daily`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to fetch daily puzzle');
  const data = await res.json();
  return {
    id: data.puzzle.id,
    fen: data.game.fen,
    solution: data.puzzle.solution,
    rating: data.puzzle.rating,
    themes: data.puzzle.themes || [],
  };
}

export async function getOpeningExplorer(fen: string): Promise<{
  moves: { san: string; white: number; black: number; draws: number; total: number }[];
}> {
  const params = new URLSearchParams({ fen, variant: 'standard' });
  const res = await fetch(
    `${LICHESS_API}/opening?${params.toString()}`,
    { headers: { Accept: 'application/json' } },
  );
  if (!res.ok) throw new Error('Failed to fetch opening explorer');
  const data = await res.json();
  return {
    moves: (data.moves || []).map((m: { san: string; white: number; black: number; draws: number }) => ({
      san: m.san,
      white: m.white,
      black: m.black,
      draws: m.draws,
      total: m.white + m.black + m.draws,
    })),
  };
}