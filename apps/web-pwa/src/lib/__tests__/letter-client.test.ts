import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ConversationResponse } from "@pharmacist-tree-hollow/shared";
import { staticToAILetter } from "../letter-adapter";
import { buildResponse } from "../respond";

vi.mock("../respond", () => ({
  buildResponse: vi.fn()
}));

const staticResponse: ConversationResponse = {
  riskLevel: "normal",
  careTitle: "下班後還留在現場的腦袋",
  message: ["下班了，腦袋卻還留在工作裡。"],
  empathy: "下班後腦袋還留在工作裡，代表今天真的被塞得很滿。",
  praise: "你不是還不夠努力，是已經努力太久了。",
  praiseNotes: ["下班後腦袋還跟著轉，代表你今天接住了很多人。"],
  tinyAction: "先慢慢吐一口氣。",
  followupActions: []
};

const aiLetter = {
  mode: "gentle",
  careTitle: "聽起來很累",
  hold: "你今天撐得很好",
  praise: "你有來說出來，這很勇敢",
  praiseNotes: ["note1", "note2"],
  anchor: "你不是一個人",
  reframe: "這只是一個片段",
  bodyCheck: "深吸一口氣",
  breathePrompt: "慢慢來",
  microAction: "喝一杯水",
  safetyCheck: false
};

const mockedBuildResponse = vi.mocked(buildResponse);

function expectedFallback() {
  return staticToAILetter(staticResponse);
}

async function importClient() {
  return import("../letter-client");
}

describe("requestAILetter", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mockedBuildResponse.mockReturnValue(staticResponse);
  });

  it("成功時回 AI letter（source=ai）", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(aiLetter)
    }) as unknown as typeof fetch;

    const { requestAILetter } = await importClient();
    const result = await requestAILetter("今天很累", "累");

    expect(result).toEqual({ letter: aiLetter, source: "ai" });
    expect(global.fetch).toHaveBeenCalledWith("/api/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: "今天很累", mood: "累" })
    });
  });

  it("API 5xx 時 fallback 到靜態", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn()
    }) as unknown as typeof fetch;

    const { requestAILetter } = await importClient();
    const result = await requestAILetter("今天很累", "累");

    expect(result).toEqual({ letter: expectedFallback(), source: "fallback" });
    expect(mockedBuildResponse).toHaveBeenCalledWith("今天很累", "累");
  });

  it("API 429 → throws RateLimitedError（不 fallback）", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({ error: "rate_limit" })
    }) as unknown as typeof fetch;

    const { requestAILetter, RateLimitedError } = await importClient();
    await expect(requestAILetter("test", "煩")).rejects.toBeInstanceOf(RateLimitedError);
    expect(mockedBuildResponse).not.toHaveBeenCalled();
  });

  it("fetch reject 時 fallback", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network down")) as unknown as typeof fetch;

    const { requestAILetter } = await importClient();
    const result = await requestAILetter("今天很累", "累");

    expect(result).toEqual({ letter: expectedFallback(), source: "fallback" });
    expect(mockedBuildResponse).toHaveBeenCalledWith("今天很累", "累");
  });

  it("回應 JSON parse fail 時 fallback", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockRejectedValue(new Error("bad json"))
    }) as unknown as typeof fetch;

    const { requestAILetter } = await importClient();
    const result = await requestAILetter("今天很累", "累");

    expect(result).toEqual({ letter: expectedFallback(), source: "fallback" });
    expect(mockedBuildResponse).toHaveBeenCalledWith("今天很累", "累");
  });

  it("AI mode 無 mode 欄位時 fallback（不合 schema）", async () => {
    const { mode: _mode, ...invalidLetter } = aiLetter;
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(invalidLetter)
    }) as unknown as typeof fetch;

    const { requestAILetter } = await importClient();
    const result = await requestAILetter("今天很累", "累");

    expect(result).toEqual({ letter: expectedFallback(), source: "fallback" });
    expect(mockedBuildResponse).toHaveBeenCalledWith("今天很累", "累");
  });
});
