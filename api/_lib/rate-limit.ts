import { kv } from '@vercel/kv';

const LIMIT = 5;
const TTL_SECONDS = 86400;

export interface RateLimitResult {
  allowed: boolean;
  count: number;
  limit: number;
}

function todayKey(ip: string): string {
  const d = new Date();
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `rate:${ip}:${yyyy}-${mm}-${dd}`;
}

export async function checkAndIncrementIp(ip: string): Promise<RateLimitResult> {
  try {
    const key = todayKey(ip);
    const count = await kv.incr(key);
    if (count === 1) {
      await kv.expire(key, TTL_SECONDS);
    }
    return { allowed: count <= LIMIT, count, limit: LIMIT };
  } catch {
    return { allowed: true, count: 0, limit: LIMIT };
  }
}
