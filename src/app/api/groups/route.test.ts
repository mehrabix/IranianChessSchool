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
    leftJoin: () => createQuery(rows),
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
  users: { name: 'name', image: 'image', id: 'id' },
}));

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(() => Promise.resolve(null)),
}));

import { GET, POST } from './route';
import { auth } from '@/lib/auth';

const { createQuery } = mockDb;

describe('GET /api/groups', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns groups array with 200 status', async () => {
    const groupsData = [
      { id: 'g1', name: 'Chess Openings', memberCount: 5 },
      { id: 'g2', name: 'Endgame Masters', memberCount: 3 },
    ];
    mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery(groupsData)) });

    const res = await GET(new Request('http://localhost/api/groups'));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.groups).toHaveLength(2);
    expect(body.groups[0].id).toBe('g1');
    expect(body.groups[1].id).toBe('g2');
  });

  it('handles errors with 500', async () => {
    mockDb.select.mockReturnValue({ from: vi.fn(() => { throw new Error('DB error'); }) });

    const res = await GET(new Request('http://localhost/api/groups'));
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe('Failed');
  });
});

describe('POST /api/groups', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(auth).mockResolvedValue(null);
  });

  it('returns 401 without auth', async () => {
    const req = new Request('http://localhost/api/groups', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test Group' }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe('Unauthorized');
  });

  it('returns 400 with no name', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'user-1' } });
    const req = new Request('http://localhost/api/groups', {
      method: 'POST',
      body: JSON.stringify({ description: 'Missing name' }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe('Name required');
  });

  it('returns 400 with empty name string', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'user-1' } });
    const req = new Request('http://localhost/api/groups', {
      method: 'POST',
      body: JSON.stringify({ name: '   ' }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe('Name required');
  });

  it('creates group successfully with 201', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'user-1' } });
    const newGroup = { id: 'g-new', name: 'New Group', description: null, category: 'GENERAL', createdBy: 'user-1' };
    mockDb.insert.mockReturnValue({
      values: vi.fn(() => ({ returning: vi.fn(() => Promise.resolve([newGroup])) })),
    });

    const req = new Request('http://localhost/api/groups', {
      method: 'POST',
      body: JSON.stringify({ name: 'New Group', description: 'A cool group', category: 'TACTICS' }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.group.id).toBe('g-new');
    expect(body.group.name).toBe('New Group');
    expect(mockDb.insert).toHaveBeenCalledTimes(2);
  });
});
