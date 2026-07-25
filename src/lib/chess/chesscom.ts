const CHESS_COM_API = 'https://api.chess.com/pub';

export interface ChessComProfile {
  username: string;
  name: string;
  avatar: string;
  rating: number;
  title: string;
}

export interface ChessComGame {
  url: string;
  pgn: string;
  time_control: string;
  end_time: number;
  rated: boolean;
  fen: string;
  time_class: string;
  rules: string;
  white: { username: string; rating: number };
  black: { username: string; rating: number };
}

export interface ChessComStats {
  chess_rapid: { last: { rating: number }; best: { rating: number } };
  chess_blitz: { last: { rating: number }; best: { rating: number } };
  chess_bullet: { last: { rating: number }; best: { rating: number } };
}

export async function getProfile(username: string): Promise<ChessComProfile> {
  const res = await fetch(`${CHESS_COM_API}/player/${username}`);
  if (!res.ok) throw new Error(`Chess.com profile not found: ${username}`);
  const data = await res.json();
  return {
    username: data.username,
    name: data.name || data.username,
    avatar: data.avatar || '',
    rating: data.rating || 0,
    title: data.title || '',
  };
}

export async function getStats(username: string): Promise<ChessComStats> {
  const res = await fetch(`${CHESS_COM_API}/player/${username}/stats`);
  if (!res.ok) throw new Error(`Chess.com stats not found: ${username}`);
  return res.json();
}

export async function getGames(
  username: string,
  year?: number,
  month?: number,
): Promise<ChessComGame[]> {
  const now = new Date();
  const y = year || now.getUTCFullYear();
  const m = month || now.getUTCMonth() + 1;
  const res = await fetch(
    `${CHESS_COM_API}/player/${username}/games/${y}/${String(m).padStart(2, '0')}`,
  );
  if (!res.ok) throw new Error(`Chess.com games not found for ${username}`);
  const data = await res.json();
  return data.games || [];
}

export async function importGames(username: string): Promise<ChessComGame[]> {
  const now = new Date();
  const all: ChessComGame[] = [];
  for (let i = 0; i < 3; i++) {
    const d = new Date(now.getUTCFullYear(), now.getUTCMonth() - i, 1);
    const games = await getGames(username, d.getUTCFullYear(), d.getUTCMonth() + 1);
    all.push(...games);
  }
  return all;
}