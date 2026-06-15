import { beforeEach, describe, expect, it, vi } from "vitest";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const mockCallGemini = vi.hoisted(() => vi.fn());
const mockCheckAndIncrementIp = vi.hoisted(() => vi.fn());
const mockIsBudgetExhausted = vi.hoisted(() => vi.fn());

vi.mock("../gemini-client.js", () => ({
  callGemini: mockCallGemini
}));

vi.mock("../rate-limit.js", () => ({
  checkAndIncrementIp: mockCheckAndIncrementIp
}));

vi.mock("../budget.js", () => ({
  isBudgetExhausted: mockIsBudgetExhausted
}));

import handler from "../../respond";

function mockReq(body: unknown): VercelRequest {
  return {
    method: "POST",
    body,
    headers: {
      "x-forwarded-for": "203.0.113.10"
    }
  } as unknown as VercelRequest;
}

function mockRes() {
  const res = {
    status: vi.fn(),
    json: vi.fn()
  };
  res.status.mockReturnValue(res);
  return res as unknown as VercelResponse & typeof res;
}

describe("respond API safety pre-check", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsBudgetExhausted.mockReturnValue(false);
    mockCheckAndIncrementIp.mockResolvedValue({ allowed: true, count: 1, limit: 5 });
    mockCallGemini.mockResolvedValue({
      mode: "hold_and_praise",
      careTitle: "今晚先放著",
      hold: "這張紙被看見了。",
      praise: "你有把話說出來。",
      praiseNotes: ["這不是小事。"]
    });
  });

  it("returns a crisis letter without calling Gemini", async () => {
    const res = mockRes();

    await handler(mockReq({ input: "我真的不想活了", mood: "想哭" }), res);

    expect(mockCallGemini).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      mode: "crisis",
      praise: "",
      praiseNotes: [],
      source: "safety"
    }));
  });

  it("returns a medical boundary letter without calling Gemini", async () => {
    const res = mockRes();

    await handler(mockReq({ input: "這個病人腎功能不好，處方劑量要不要調整？", mood: "緊繃" }), res);

    expect(mockCallGemini).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      mode: "hold_only",
      praise: "",
      praiseNotes: [],
      source: "safety"
    }));
  });

  it("returns a privacy boundary letter without calling Gemini", async () => {
    const res = mockRes();

    await handler(mockReq({ input: "姓名：王小明 電話：0912345678 病歷號：123456789", mood: "煩" }), res);

    expect(mockCallGemini).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      mode: "hold_only",
      praise: "",
      praiseNotes: [],
      source: "safety"
    }));
  });
});
