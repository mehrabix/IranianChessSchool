import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockDb } = vi.hoisted(() => ({
  mockDb: { select: vi.fn(), insert: vi.fn(), update: vi.fn(), delete: vi.fn() },
}));

vi.mock('@/lib/db', () => ({
  db: mockDb,
  eq: vi.fn((a: any, b: any) => ({ left: a, right: b })),
  and: vi.fn(),
  or: vi.fn(),
  desc: vi.fn(),
  asc: vi.fn(),
  sql: vi.fn(),
  like: vi.fn(),
  inArray: vi.fn(),
  between: vi.fn(),
  not: vi.fn(),
  isNull: vi.fn(),
  isNotNull: vi.fn(),
  users: { id: 'id' },
  courses: { id: 'id' },
  modules: { id: 'id' },
  lessons: { id: 'id' },
  progress: { id: 'id' },
  posts: { id: 'id', content: 'content' },
}));

import { GET } from './route';

describe('GET /api/posts', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns all posts', async () => {
    const mockThen = vi.fn((fn: any) => Promise.resolve(fn([{ id: 'p1', content: 'Post 1' }])));
    const mockOrderBy = vi.fn(() => ({ then: mockThen }));
    const mockFrom = vi.fn(() => ({ orderBy: mockOrderBy }));
    mockDb.select.mockReturnValue({ from: mockFrom });

    const res = await GET(new Request('http://localhost/api/posts'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.posts).toHaveLength(1);
  });

  it('returns a single post by id', async () => {
    const mockThen = vi.fn((fn: any) => Promise.resolve(fn([{ id: 'p1', content: 'Post 1' }])));
    const mockWhere = vi.fn(() => ({ then: mockThen }));
    const mockFrom = vi.fn(() => ({ where: mockWhere }));
    mockDb.select.mockReturnValue({ from: mockFrom });

    const res = await GET(new Request('http://localhost/api/posts?id=p1'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.post).toBeDefined();
  });

  it('returns 404 for non-existent post', async () => {
    const mockThen = vi.fn((fn: any) => Promise.resolve(fn([])));
    const mockWhere = vi.fn(() => ({ then: mockThen }));
    const mockFrom = vi.fn(() => ({ where: mockWhere }));
    mockDb.select.mockReturnValue({ from: mockFrom });

    const res = await GET(new Request('http://localhost/api/posts?id=nonexistent'));
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe('Not found');
  });
});
