import type { VercelRequest, VercelResponse } from '@vercel/node';
import { classifySafety } from '@pharmacist-tree-hollow/ai-safety';
import type { AILetterResponse } from '@pharmacist-tree-hollow/shared';
import { callGemini } from './_lib/gemini-client.js';
import { checkAndIncrementIp } from './_lib/rate-limit.js';
import { isBudgetExhausted } from './_lib/budget.js';

const MAX_INPUT_LEN = 500;
const VALID_MOODS = ['累', '煩', '委屈', '想哭', '空', '緊繃', '還可以'];

function buildSafetyLetter(riskLevel: "crisis" | "medical_boundary" | "privacy"): AILetterResponse {
  if (riskLevel === "crisis") {
    return {
      mode: "crisis",
      careTitle: "先讓人陪著你",
      hold: "這句話很重，也很急。今晚先不要一個人扛著它。",
      praise: "",
      praiseNotes: []
    };
  }

  if (riskLevel === "medical_boundary") {
    return {
      mode: "hold_only",
      careTitle: "回到正式流程",
      hold: "這個情境需要正式判斷流程。這裡不能替你做用藥、處置或責任判斷。",
      praise: "",
      praiseNotes: []
    };
  }

  return {
    mode: "hold_only",
    careTitle: "只留下你的壓力",
    hold: "這張紙裡出現了可識別資料。這裡先不保留、不重複那些內容，只陪你放下壓力。",
    praise: "",
    praiseNotes: []
  };
}

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
  const safety = classifySafety(truncatedInput);
  if (safety.riskLevel !== "normal") {
    res.status(200).json({ ...buildSafetyLetter(safety.riskLevel), source: 'safety' });
    return;
  }

  try {
    const letter = await callGemini(truncatedInput, mood);
    res.status(200).json({ ...letter, source: 'ai' });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'ai_failed' });
  }
}
