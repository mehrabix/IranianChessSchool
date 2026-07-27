import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockDb = vi.hoisted(() => {
  const createQuery = (rows: any[]) => ({
    where: () => createQuery(rows),
    then: (fn: any) => Promise.resolve(fn(rows)),
    orderBy: () => createQuery(rows),
    limit: () => createQuery(rows),
    leftJoin: () => createQuery(rows),
    returning: () => Promise.resolve(rows),
  });
  return {
    select: vi.fn(() => ({ from: vi.fn(() => createQuery([])) })),
    insert: vi.fn(() => ({ values: vi.fn(() => ({ returning: vi.fn(() => Promise.resolve([{}])) })) })),
    update: vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn(() => Promise.resolve()) })) })),
    delete: vi.fn(() => ({ where: vi.fn(() => Promise.resolve()) })),
    createQuery,
  };
});

vi.mock('@/lib/db', () => ({
  db: mockDb,
  eq: vi.fn((a: any, b: any) => ({ left: a, right: b })),
  and: vi.fn(),
  desc: vi.fn(),
  sql: vi.fn((literals: TemplateStringsArray, ...exprs: any[]) => ({ raw: literals.join('?'), params: exprs })),
  posts: { id: 'id', comments: 'comments', likes: 'likes' },
  comments: { id: 'id', postId: 'postId', userId: 'userId', content: 'content', createdAt: 'createdAt' },
  users: { id: 'id', name: 'name', image: 'image' },
  notifications: { id: 'id', userId: 'userId', type: 'type', title: 'title', body: 'body', link: 'link', read: 'read', createdAt: 'createdAt' },
}));

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(() => Promise.resolve(null)),
}));

import { GET, POST } from './route';
import { auth } from '@/lib/auth';

const { createQuery } = mockDb;

describe('GET /api/posts/[id]/comments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns comments array with 200 status', async () => {
    const commentsData = [
      { id: 'c1', content: 'Nice post!', createdAt: '2025-01-01', userId: 'u1', userName: 'Alice', userImage: null },
      { id: 'c2', content: 'Great work', createdAt: '2025-01-02', userId: 'u2', userName: 'Bob', userImage: '/avatar.png' },
    ];
    mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery(commentsData)) });

    const req = new Request('http://localhost/api/posts/post-1/comments');
    const res = await GET(req, { params: Promise.resolve({ id: 'post-1' }) });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.comments).toHaveLength(2);
    expect(body.comments[0].id).toBe('c1');
    expect(body.comments[1].content).toBe('Great work');
  });

  it('handles errors with 500', async () => {
    mockDb.select.mockReturnValue({ from: vi.fn(() => { throw new Error('DB error'); }) });

    const req = new Request('http://localhost/api/posts/post-1/comments');
    const res = await GET(req, { params: Promise.resolve({ id: 'post-1' }) });
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe('Failed to fetch comments');
  });
});

describe('POST /api/posts/[id]/comments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(auth).mockResolvedValue(null);
  });

  it('returns 401 without auth', async () => {
    const req = new Request('http://localhost/api/posts/post-1/comments', {
      method: 'POST',
      body: JSON.stringify({ content: 'My comment' }),
    });

    const res = await POST(req, { params: Promise.resolve({ id: 'post-1' }) });
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe('Unauthorized');
  });

  it('returns 400 with no content', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'user-1' } });
    const req = new Request('http://localhost/api/posts/post-1/comments', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const res = await POST(req, { params: Promise.resolve({ id: 'post-1' }) });
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe('Content is required');
  });

  it('creates comment successfully with 201', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'user-1' } });
    const { createQuery } = mockDb;

    // Mock: select for post owner (returns post by user-2 to trigger notification)
    const postQuery = createQuery([{ userId: 'user-2' }]);
    // Mock: select for commenter name
    const userQuery = createQuery([{ name: 'Commenter' }]);
    let callCount = 0;
    mockDb.select.mockImplementation(() => ({
      from: vi.fn(() => {
        callCount++;
        // First select after insert+update is for posts, second is for users
        return callCount === 1 ? postQuery : userQuery;
      }),
    }));

    const req = new Request('http://localhost/api/posts/post-1/comments', {
      method: 'POST',
      body: JSON.stringify({ content: 'Nice article!' }),
    });

    const res = await POST(req, { params: Promise.resolve({ id: 'post-1' }) });
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.success).toBe(true);
    expect(mockDb.insert).toHaveBeenCalled();
  });
});
