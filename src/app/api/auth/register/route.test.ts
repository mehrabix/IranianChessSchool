import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockDb, mockWhere, mockFrom, mockSelect, createMockArray } = vi.hoisted(() => {
  const createMockArray = (data: any[]) => ({
    then: (fn: any) => Promise.resolve(fn(data)),
    get: () => Promise.resolve(data[0]),
  });
  const mockWhere = vi.fn(() => createMockArray([]));
  const mockFrom = vi.fn(() => ({ orderBy: vi.fn(() => createMockArray([])), where: mockWhere }));
  const mockSelect = vi.fn(() => ({ from: mockFrom }));
  const mockDb = { select: mockSelect, insert: vi.fn(() => ({ values: vi.fn(() => Promise.resolve()) })), update: vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn(() => Promise.resolve()) })) })), delete: vi.fn(() => ({ where: vi.fn(() => Promise.resolve()) })) };
  return { mockDb, mockWhere, mockFrom, mockSelect, createMockArray };
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
  users: { email: 'email' },
  courses: {},
  modules: {},
  lessons: {},
  progress: {},
  posts: {},
}));

vi.mock('bcryptjs', () => ({ hash: vi.fn(() => Promise.resolve('hashed')), compare: vi.fn(() => Promise.resolve(true)) }));

import { POST } from './route';

describe('POST /api/auth/register', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('short name', async () => {
    const req = new Request('http://localhost/api/auth/register', { method: 'POST', body: JSON.stringify({ name: 'A', email: 'test@t.com', password: 'password123' }) });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('Name is too short');
  });

  it('invalid email', async () => {
    const req = new Request('http://localhost/api/auth/register', { method: 'POST', body: JSON.stringify({ email: 'invalid', password: 'password123' }) });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('short password', async () => {
    const req = new Request('http://localhost/api/auth/register', { method: 'POST', body: JSON.stringify({ name: 'Test', email: 'test@t.com', password: 'short' }) });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('duplicate email', async () => {
    mockFrom.mockReturnValue({ where: mockWhere });
    mockWhere.mockReturnValue(createMockArray([{ id: 'e1', email: 'test@t.com' }]));
    const req = new Request('http://localhost/api/auth/register', { method: 'POST', body: JSON.stringify({ name: 'Test', email: 'test@t.com', password: 'password123' }) });
    const res = await POST(req);
    expect(res.status).toBe(409);
  });

  it('creates user successfully', async () => {
    mockFrom.mockReturnValue({ where: mockWhere });
    mockWhere.mockReturnValue(createMockArray([]));
    const req = new Request('http://localhost/api/auth/register', { method: 'POST', body: JSON.stringify({ name: 'Test User', email: 'test@t.com', password: 'password123' }) });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.email).toBe('test@t.com');
  });
});
