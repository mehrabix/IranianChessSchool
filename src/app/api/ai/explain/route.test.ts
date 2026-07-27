import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockExplain = vi.hoisted(() => vi.fn());

vi.mock('@/lib/ai-coach', () => ({ explainPosition: mockExplain }));

import { POST } from './route';

describe('AI Explain API', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns 400 when no FEN provided', async () => {
    const req = new Request('http://localhost/api/ai/explain', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.error).toBe('FEN required');
  });

  it('returns explanation on success', async () => {
    mockExplain.mockResolvedValue('This is a Sicilian Defense position...');

    const req = new Request('http://localhost/api/ai/explain', {
      method: 'POST',
      body: JSON.stringify({ fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.explanation).toBe('This is a Sicilian Defense position...');
    expect(mockExplain).toHaveBeenCalledWith('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  });

  it('returns 500 when AI fails', async () => {
    mockExplain.mockRejectedValue(new Error('All AI providers failed'));

    const req = new Request('http://localhost/api/ai/explain', {
      method: 'POST',
      body: JSON.stringify({ fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);

    const body = await res.json();
    expect(body.error).toBe('AI unavailable');
  });
});
