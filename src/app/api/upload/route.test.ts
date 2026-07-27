import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockAuth = vi.hoisted(() => vi.fn());
vi.mock('@/lib/auth', () => ({ auth: mockAuth }));

const mockMkdir = vi.hoisted(() => vi.fn(() => Promise.resolve()));
const mockWriteFile = vi.hoisted(() => vi.fn(() => Promise.resolve()));

vi.mock('fs/promises', () => ({
  mkdir: mockMkdir,
  writeFile: mockWriteFile,
}));

import { POST } from './route';

function createFormData(content: string, filename: string, type = 'text/plain') {
  const formData = new FormData();
  formData.append('file', new File([content], filename, { type }));
  return formData;
}

describe('POST /api/upload', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns 401 without auth', async () => {
    mockAuth.mockResolvedValueOnce(null);
    const fd = createFormData('test content', 'test.txt');
    const res = await POST(new Request('http://localhost/api/upload', { method: 'POST', body: fd }));
    expect(res.status).toBe(401);
  });

  it('returns 400 with no file', async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } });
    const fd = new FormData();
    const res = await POST(new Request('http://localhost/api/upload', { method: 'POST', body: fd }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('No file provided');
  });

  it('writes file and returns URL on success', async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } });
    mockMkdir.mockResolvedValueOnce(undefined);
    mockWriteFile.mockResolvedValueOnce(undefined);

    const fd = createFormData('file content', 'image.png');
    const res = await POST(new Request('http://localhost/api/upload', { method: 'POST', body: fd }));

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.url).toMatch(/^\/uploads\/[a-f0-9-]+\.png$/);
    expect(mockMkdir).toHaveBeenCalled();
    expect(mockWriteFile).toHaveBeenCalled();
  });

  it('writes file without extension correctly', async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } });
    mockMkdir.mockResolvedValueOnce(undefined);
    mockWriteFile.mockResolvedValueOnce(undefined);

    const fd = createFormData('data', 'nofileextension');
    const res = await POST(new Request('http://localhost/api/upload', { method: 'POST', body: fd }));

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.url).toMatch(/^\/uploads\/[a-f0-9-]+$/);
  });

  it('handles write errors with 500', async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } });
    mockMkdir.mockRejectedValueOnce(new Error('Disk full'));

    const fd = createFormData('data', 'file.txt');
    const res = await POST(new Request('http://localhost/api/upload', { method: 'POST', body: fd }));

    expect(res.status).toBe(500);
  });
});
