import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callGemini } from './_lib/gemini-client.js';
import { checkAndIncrementIp } from './_lib/rate-limit.js';
import { isBudgetExhausted } from './_lib/budget.js';

const MAX_INPUT_LEN = 500;
const VALID_MOODS = ['累', '煩', '委屈', '想哭', '空', '緊繃', '還可以'];

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  if (isBudgetExhausted()) {
    res.status(503).json({ error: 'budget_exhausted' });
    return;
  }

  if (!req.body || typeof req.body !== 'object') {
    res.status(400).json({ error: 'missing_body' });
    return;
  }

  const { input, mood } = req.body as { input?: unknown; mood?: unknown };

  if (typeof input !== 'string') {
    res.status(400).json({ error: 'missing_input' });
    return;
  }

  if (typeof mood !== 'string') {
    res.status(400).json({ error: 'missing_mood' });
    return;
  }

  if (!VALID_MOODS.includes(mood)) {
    res.status(400).json({ error: 'invalid_mood' });
    return;
  }

  const ip = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim()
    ?? (req.headers['x-real-ip'] as string | undefined)
    ?? 'unknown';
  const limit = await checkAndIncrementIp(ip);
  if (!limit.allowed) {
    res.status(429).json({ error: 'rate_limit', count: limit.count, limit: limit.limit });
    return;
  }

  const truncatedInput = input.slice(0, MAX_INPUT_LEN);

  try {
    const letter = await callGemini(truncatedInput, mood);
    res.status(200).json({ ...letter, source: 'ai' });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'ai_failed' });
  }
}
