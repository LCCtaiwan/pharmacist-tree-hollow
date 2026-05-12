import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockIncr = vi.hoisted(() => vi.fn());
const mockExpire = vi.hoisted(() => vi.fn());

vi.mock('@vercel/kv', () => ({
  kv: {
    incr: mockIncr,
    expire: mockExpire,
  },
}));

import { checkAndIncrementIp } from '../rate-limit';

describe('checkAndIncrementIp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExpire.mockResolvedValue(1);
  });

  it('第一次請求：allowed=true, count=1, limit=5', async () => {
    mockIncr.mockResolvedValue(1);
    const result = await checkAndIncrementIp('1.2.3.4');
    expect(result.allowed).toBe(true);
    expect(result.count).toBe(1);
    expect(result.limit).toBe(5);
    expect(mockExpire).toHaveBeenCalledTimes(1);
  });

  it('第 5 次請求：allowed=true', async () => {
    mockIncr.mockResolvedValue(5);
    const result = await checkAndIncrementIp('1.2.3.4');
    expect(result.allowed).toBe(true);
    expect(result.count).toBe(5);
  });

  it('第 6 次請求：allowed=false', async () => {
    mockIncr.mockResolvedValue(6);
    const result = await checkAndIncrementIp('1.2.3.4');
    expect(result.allowed).toBe(false);
    expect(result.count).toBe(6);
  });

  it('KV 失敗時 fail-open：allowed=true', async () => {
    mockIncr.mockRejectedValue(new Error('KV error'));
    const result = await checkAndIncrementIp('1.2.3.4');
    expect(result.allowed).toBe(true);
  });
});
