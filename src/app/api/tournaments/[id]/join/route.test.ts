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
    insert: vi.fn(() => ({ values: vi.fn(() => Promise.resolve()) })),
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
  desc: vi.fn(),
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

import { POST } from './route';
import { auth } from '@/lib/auth';

const { createQuery } = mockDb;

describe('POST /api/tournaments/[id]/join', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(auth).mockResolvedValue(null);
  });

  it('returns 401 without auth', async () => {
    const req = new Request('http://localhost/api/tournaments/t1/join', { method: 'POST' });

    const res = await POST(req, { params: Promise.resolve({ id: 't1' }) });
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe('Unauthorized');
  });

  it('returns 404 for non-existent tournament', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'user-1' } });
    mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery([])) });

    const req = new Request('http://localhost/api/tournaments/nonexistent/join', { method: 'POST' });
    const res = await POST(req, { params: Promise.resolve({ id: 'nonexistent' }) });
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.error).toBe('Not found');
  });

  it('returns 400 when tournament is full', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'user-1' } });
    const tournament = { id: 't1', name: 'Full Tournament', maxPlayers: 8, status: 'UPCOMING' };
    mockDb.select
      .mockReturnValueOnce({ from: vi.fn(() => createQuery([tournament])) })
      .mockReturnValueOnce({ from: vi.fn(() => createQuery([{ count: 8 }])) });

    const req = new Request('http://localhost/api/tournaments/t1/join', { method: 'POST' });
    const res = await POST(req, { params: Promise.resolve({ id: 't1' }) });
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe('Tournament full');
    expect(mockDb.insert).not.toHaveBeenCalled();
  });

  it('joins tournament when not already joined', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'user-1' } });
    const tournament = { id: 't1', name: 'Open Tournament', maxPlayers: 16, status: 'UPCOMING' };
    mockDb.select
      .mockReturnValueOnce({ from: vi.fn(() => createQuery([tournament])) })
      .mockReturnValueOnce({ from: vi.fn(() => createQuery([{ count: 5 }])) })
      .mockReturnValue({ from: vi.fn(() => createQuery([])) });

    const req = new Request('http://localhost/api/tournaments/t1/join', { method: 'POST' });
    const res = await POST(req, { params: Promise.resolve({ id: 't1' }) });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.joined).toBe(true);
    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockDb.delete).not.toHaveBeenCalled();
  });

  it('leaves tournament when already joined', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'user-1' } });
    const tournament = { id: 't1', name: 'Open Tournament', maxPlayers: 16, status: 'UPCOMING' };
    mockDb.select
      .mockReturnValueOnce({ from: vi.fn(() => createQuery([tournament])) })
      .mockReturnValueOnce({ from: vi.fn(() => createQuery([{ count: 5 }])) })
      .mockReturnValueOnce({
        from: vi.fn(() =>
          createQuery([{ id: 'tp-1', tournamentId: 't1', userId: 'user-1', score: 0 }]),
        ),
      });

    const req = new Request('http://localhost/api/tournaments/t1/join', { method: 'POST' });
    const res = await POST(req, { params: Promise.resolve({ id: 't1' }) });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.joined).toBe(false);
    expect(mockDb.delete).toHaveBeenCalled();
    expect(mockDb.insert).not.toHaveBeenCalled();
  });
});
