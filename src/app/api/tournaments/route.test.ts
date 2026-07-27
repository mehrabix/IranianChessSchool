import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockDb = vi.hoisted(() => {
  const createQuery = (rows: any[]) => ({
    where: () => createQuery(rows),
    then: (fn: any) => Promise.resolve(fn(rows)),
    get: () => Promise.resolve(rows?.[0] ?? null),
    orderBy: () => createQuery(rows),
    limit: () => createQuery(rows),
    offset: () => createQuery(rows),
    all: () => Promise.resolve(rows),
  });
  return {
    select: vi.fn(() => ({ from: vi.fn(() => createQuery([])) })),
    insert: vi.fn(() => ({ values: vi.fn(() => ({ returning: vi.fn(() => Promise.resolve([])) })) })),
    update: vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn(() => Promise.resolve()) })) })),
    delete: vi.fn(() => ({ where: vi.fn(() => Promise.resolve()) })),
    createQuery,
  };
});

vi.mock('@/lib/db', () => ({
  db: mockDb,
  eq: vi.fn((a: any, b: any) => ({ left: a, right: b })),
  and: vi.fn(),
  or: vi.fn(),
  asc: vi.fn(),
  desc: vi.fn((col: any) => col),
  sql: vi.fn(),
  like: vi.fn(),
  inArray: vi.fn(),
  between: vi.fn(),
  not: vi.fn(),
  isNull: vi.fn(),
  isNotNull: vi.fn(),
  groups: {},
  groupMembers: {},
  tournaments: {},
  tournamentPlayers: {},
}));

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(() => Promise.resolve(null)),
}));

import { GET, POST } from './route';
import { auth } from '@/lib/auth';

const { createQuery } = mockDb;

describe('GET /api/tournaments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns tournaments array with player counts', async () => {
    const tournamentsData = [
      { id: 't1', name: 'Spring Championship', status: 'UPCOMING', maxPlayers: 16 },
      { id: 't2', name: 'Summer Cup', status: 'ACTIVE', maxPlayers: 8 },
    ];
    const playersData = [
      { id: 'tp1', tournamentId: 't1', userId: 'u1', score: 3 },
    ];
    // First select returns tournaments, subsequent select calls return players
    mockDb.select
      .mockReturnValueOnce({ from: vi.fn(() => createQuery(tournamentsData)) })
      .mockReturnValue({ from: vi.fn(() => createQuery(playersData)) });

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.tournaments).toHaveLength(2);
    expect(body.tournaments[0].id).toBe('t1');
    expect(body.tournaments[0].playerCount).toBe(1);
    expect(body.tournaments[0].players).toHaveLength(1);
    expect(body.tournaments[1].playerCount).toBe(1);
  });

  it('returns 500 on DB error', async () => {
    mockDb.select.mockReturnValue({ from: vi.fn(() => { throw new Error('DB error'); }) });

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe('Failed');
  });
});

describe('POST /api/tournaments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(auth).mockResolvedValue(null);
  });

  it('returns 401 without auth', async () => {
    const req = new Request('http://localhost/api/tournaments', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test Tournament' }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe('Unauthorized');
  });

  it('returns 400 with no name', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'user-1' } });
    const req = new Request('http://localhost/api/tournaments', {
      method: 'POST',
      body: JSON.stringify({ type: 'SWISS' }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe('Name required');
  });

  it('creates tournament successfully with 201 and defaults maxPlayers to 16', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'user-1' } });
    const newTournament = {
      id: 't-new',
      name: 'New Tournament',
      description: null,
      type: 'SWISS',
      maxPlayers: 16,
      createdBy: 'user-1',
    };
    mockDb.insert.mockReturnValue({
      values: vi.fn(() => ({ returning: vi.fn(() => Promise.resolve([newTournament])) })),
    });

    const req = new Request('http://localhost/api/tournaments', {
      method: 'POST',
      body: JSON.stringify({ name: 'New Tournament' }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.tournament.id).toBe('t-new');
    expect(body.tournament.name).toBe('New Tournament');
    expect(body.tournament.maxPlayers).toBe(16);
    expect(mockDb.insert).toHaveBeenCalled();
  });

  it('creates tournament with explicit maxPlayers', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'user-1' } });
    const newTournament = {
      id: 't-custom',
      name: 'Custom Capacity',
      description: 'Small event',
      type: 'KNOCKOUT',
      maxPlayers: 4,
      createdBy: 'user-1',
    };
    mockDb.insert.mockReturnValue({
      values: vi.fn(() => ({ returning: vi.fn(() => Promise.resolve([newTournament])) })),
    });

    const req = new Request('http://localhost/api/tournaments', {
      method: 'POST',
      body: JSON.stringify({ name: 'Custom Capacity', type: 'KNOCKOUT', maxPlayers: 4 }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.tournament.maxPlayers).toBe(4);
    expect(body.tournament.type).toBe('KNOCKOUT');
  });
});
