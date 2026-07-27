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

describe('POST /api/groups/[id]/join', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(auth).mockResolvedValue(null);
  });

  it('returns 401 without auth', async () => {
    const req = new Request('http://localhost/api/groups/g1/join', { method: 'POST' });

    const res = await POST(req, { params: Promise.resolve({ id: 'g1' }) });
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe('Unauthorized');
  });

  it('joins group when not a member', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'user-1' } });
    mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery([])) });

    const req = new Request('http://localhost/api/groups/g1/join', { method: 'POST' });
    const res = await POST(req, { params: Promise.resolve({ id: 'g1' }) });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.joined).toBe(true);
    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockDb.update).toHaveBeenCalled();
    expect(mockDb.delete).not.toHaveBeenCalled();
  });

  it('leaves group when already a member', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'user-1' } });
    mockDb.select.mockReturnValue({
      from: vi.fn(() =>
        createQuery([{ id: 'gm-1', groupId: 'g1', userId: 'user-1', role: 'MEMBER' }]),
      ),
    });

    const req = new Request('http://localhost/api/groups/g1/join', { method: 'POST' });
    const res = await POST(req, { params: Promise.resolve({ id: 'g1' }) });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.joined).toBe(false);
    expect(mockDb.delete).toHaveBeenCalled();
    expect(mockDb.update).toHaveBeenCalled();
    expect(mockDb.insert).not.toHaveBeenCalled();
  });
});
