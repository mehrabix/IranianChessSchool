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

  http.get('http://localhost:3000/api/groups', () => {
    return HttpResponse.json({
      groups: [{ id: 'g1', name: 'Beginners', memberCount: 5, category: 'GENERAL' }],
    });
  }),

  http.get('http://localhost:3000/api/tournaments', () => {
    return HttpResponse.json({
      tournaments: [{ id: 't1', name: 'Blitz Cup', type: 'SWISS', status: 'UPCOMING', maxPlayers: 16, playerCount: 3 }],
    });
  }),

  http.get('http://localhost:3000/api/leaderboard', () => {
    return HttpResponse.json({
      users: [{ id: 'u1', name: 'Player 1', xp: 500, level: 5, rating: 1200 }],
    });
  }),

  http.get('http://localhost:3000/api/posts', () => {
    return HttpResponse.json({
      posts: [{ id: 'p1', content: 'Hello', userId: 'u1', userName: 'Alice', likes: 3, comments: 1 }],
    });
  }),

  http.get('http://localhost:3000/api/progress', () => {
    return HttpResponse.json({
      progress: [{ id: 'r1', lessonId: 'l1', completed: true, score: 80 }],
    });
  }),

  http.get('http://localhost:3000/api/lessons', ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (id === 'nonexistent') {
      return HttpResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }
    return HttpResponse.json({
      lesson: { id: id || 'l1', title: 'Forks', type: 'TEXT', content: '...' },
      module: { title: 'Tactics' },
      course: { id: 'c1', title: 'Beginner' },
    });
  }),

  http.get('http://localhost:3000/api/quizzes', ({ request }) => {
    const url = new URL(request.url);
    const lessonId = url.searchParams.get('lessonId');
    if (lessonId === 'nonexistent') {
      return HttpResponse.json({ error: 'Quizzes not found' }, { status: 404 });
    }
    return HttpResponse.json({
      quizzes: [{ id: 'q1', title: 'Piece Movement' }],
    });
  }),

  http.get('http://localhost:3000/api/notifications', () => {
    return HttpResponse.json({
      notifications: [{ id: 'n1', type: 'LIKE', title: 'Someone liked your post' }],
      unread: 1,
    });
  }),
];

export const errorHandler = http.all('*', () => {
  return new HttpResponse(null, { status: 500 });
});
