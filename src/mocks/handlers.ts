import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('http://localhost:3000/api/courses', ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (id) {
      if (id === 'nonexistent') {
        return HttpResponse.json({ error: 'Course not found' }, { status: 404 });
      }
      return HttpResponse.json({
        course: { id, title: 'Test Course', description: 'A test course', level: 'BEGINNER', published: true },
        modules: [],
      });
    }
    return HttpResponse.json({
      courses: [
        { id: '1', title: 'Course 1', description: 'First course', level: 'BEGINNER', published: true },
        { id: '2', title: 'Course 2', description: 'Second course', level: 'INTERMEDIATE', published: true },
      ],
    });
  }),

  http.post('http://localhost:3000/api/contact', async ({ request }) => {
    const body: any = await request.json();
    if (!body.name || !body.email || !body.message) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    return HttpResponse.json({ success: true });
  }),

  http.post('http://localhost:3000/api/auth/register', async ({ request }) => {
    const body: any = await request.json();
    if (!body.name || !body.email || !body.password) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (body.email === 'existing@test.com') {
      return HttpResponse.json({ error: 'Email already in use' }, { status: 409 });
    }
    return HttpResponse.json({ id: 'new-user', name: body.name, email: body.email });
  }),

  http.post('http://localhost:3000/api/chess/import/chesscom', async ({ request }) => {
    const body: any = await request.json();
    if (!body.username) {
      return HttpResponse.json({ error: 'Username is required' }, { status: 400 });
    }
    return HttpResponse.json({ games: [{ pgn: '1. e4', url: 'g1' }] });
  }),

  http.post('http://localhost:3000/api/chess/import/lichess', async ({ request }) => {
    const body: any = await request.json();
    if (!body.username) {
      return HttpResponse.json({ error: 'Username is required' }, { status: 400 });
    }
    return HttpResponse.json({ games: [{ id: 'g1', pgn: '1. d4' }] });
  }),

  http.post('http://localhost:3000/api/chess/analyze', async ({ request }) => {
    const body: any = await request.json();
    if (!body.pgn || !body.pgn.trim()) {
      return HttpResponse.json({ error: 'PGN is required' }, { status: 400 });
    }
    if (!body.pgn.match(/\d+\.\s*[a-hNBRQK]/)) {
      return HttpResponse.json({ error: 'Invalid PGN' }, { status: 400 });
    }
    const moves = ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Bxc6', 'dxc6'];
    const moveCount = Math.min(body.pgn.split(/\s+/).filter((s: string) => !s.endsWith('.') && !s.match(/^\d+\./)).length, moves.length);
    return HttpResponse.json({
      moves: Array.from({ length: moveCount }, (_, i) => ({
        san: moves[i],
        eval: i % 2 === 0 ? 0.2 : -0.1,
        depth: 18,
        bestMove: '',
        isBlunder: false,
      })),
      totalAccuracy: 95.0,
    });
  }),
];

export const errorHandler = http.all('*', () => {
  return new HttpResponse(null, { status: 500 });
});
