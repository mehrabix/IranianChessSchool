const PROVIDERS = [
  { baseUrl: 'https://openrouter.ai/api/v1', key: process.env.OPENROUTER_API_KEY, model: 'google/gemini-2.5-flash-lite:free' },
  { baseUrl: 'https://api.groq.com/openai/v1', key: process.env.GROQ_API_KEY, model: 'llama-3.3-70b-versatile' },
  { baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai', key: process.env.GEMINI_API_KEY, model: 'gemini-2.0-flash' },
  { baseUrl: 'https://api.mistral.ai/v1', key: process.env.MISTRAL_API_KEY, model: 'mistral-small-latest' },
];

export async function aiChat(messages: { role: string; content: string }[]): Promise<string> {
  for (const provider of PROVIDERS) {
    if (!provider.key) continue;
    try {
      const res = await fetch(`${provider.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${provider.key}`,
        },
        body: JSON.stringify({ model: provider.model, messages, max_tokens: 500 }),
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) continue;
      const data = await res.json() as any;
      return data.choices?.[0]?.message?.content || '';
    } catch {
      continue;
    }
  }
  throw new Error('All AI providers failed');
}

export async function explainPosition(fen: string, level = 'intermediate'): Promise<string> {
  const prompt = `Explain this chess position (FEN: ${fen}) for a ${level} player. Focus on key plans, threats, material balance, and the best strategic idea. Keep it under 3 sentences.`;
  return aiChat([{ role: 'user', content: prompt }]);
}

export async function analyzeMove(pgn: string, moveNumber: number): Promise<string> {
  const prompt = `Analyze move ${moveNumber} in this chess game PGN: ${pgn}. Explain why it's good or bad, and suggest a better alternative if applicable. Keep it brief.`;
  return aiChat([{ role: 'user', content: prompt }]);
}
