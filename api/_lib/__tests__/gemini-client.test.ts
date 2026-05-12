import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { generateContentMock, GoogleGenAIMock } = vi.hoisted(() => {
  const generateContentMock = vi.fn();
  const GoogleGenAIMock = vi.fn(function GoogleGenAI() {
    return {
      models: {
        generateContent: generateContentMock
      }
    };
  });

  return { generateContentMock, GoogleGenAIMock };
});

function createClientMock() {
  return {
    models: {
      generateContent: generateContentMock
    }
  };
}

vi.mock("@google/genai", () => ({
  GoogleGenAI: GoogleGenAIMock,
  HarmCategory: {
    HARM_CATEGORY_HARASSMENT: "HARM_CATEGORY_HARASSMENT",
    HARM_CATEGORY_HATE_SPEECH: "HARM_CATEGORY_HATE_SPEECH",
    HARM_CATEGORY_SEXUALLY_EXPLICIT: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    HARM_CATEGORY_DANGEROUS_CONTENT: "HARM_CATEGORY_DANGEROUS_CONTENT"
  },
  HarmBlockThreshold: {
    BLOCK_ONLY_HIGH: "BLOCK_ONLY_HIGH",
    BLOCK_MEDIUM_AND_ABOVE: "BLOCK_MEDIUM_AND_ABOVE"
  }
}));

const validLetter = {
  mode: "hold_and_praise",
  careTitle: "那陣刺還沒散",
  hold: "那股刺人的聲音，今晚還留在身上。",
  praise: "你沒有把場面丟出去，還把紀錄補回該在的位置。",
  praiseNotes: ["你被衝撞後仍回到流程。", "你把該補的紀錄補上。"]
};

describe("callGemini", () => {
  beforeEach(() => {
    vi.resetModules();
    generateContentMock.mockReset();
    GoogleGenAIMock.mockClear();
    GoogleGenAIMock.mockImplementation(function GoogleGenAI() {
      return createClientMock();
    });
    process.env.GEMINI_API_KEY = "test-gemini-key";
  });

  afterEach(() => {
    delete process.env.GEMINI_API_KEY;
  });

  it("assembles user message from input and mood and calls generateContent", async () => {
    generateContentMock.mockResolvedValue({ text: JSON.stringify(validLetter) });

    const { callGemini } = await import("../gemini-client");
    await callGemini("今天被民眾罵，還是把紀錄補完了。", "煩");

    expect(GoogleGenAIMock).toHaveBeenCalledWith({ apiKey: "test-gemini-key" });
    expect(generateContentMock).toHaveBeenCalledTimes(1);
    expect(generateContentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "gemini-2.5-flash",
        config: expect.objectContaining({
          responseMimeType: "application/json",
          responseSchema: expect.any(Object),
          temperature: 0.8,
          maxOutputTokens: 800
        }),
        contents: [
          {
            role: "user",
            parts: [
              {
                text: expect.stringContaining("紙條：今天被民眾罵，還是把紀錄補完了。")
              }
            ]
          }
        ]
      })
    );
    expect(generateContentMock.mock.calls[0][0].contents[0].parts[0].text).toContain("心情：煩");
  });

  it("returns parsed JSON object on valid response", async () => {
    generateContentMock.mockResolvedValue({ text: JSON.stringify(validLetter) });

    const { callGemini } = await import("../gemini-client");
    await expect(callGemini("今天調劑台很滿，但沒有漏掉核對。", "累")).resolves.toEqual(validLetter);
  });

  it("throws when Gemini returns non-JSON text", async () => {
    generateContentMock.mockResolvedValue({ text: "這不是 JSON" });

    const { callGemini } = await import("../gemini-client");
    await expect(callGemini("今天很亂。", "亂")).rejects.toThrow(/JSON/i);
  });

  it("throws when response JSON fails schema validation", async () => {
    generateContentMock.mockResolvedValue({
      text: JSON.stringify({
        ...validLetter,
        mode: "unknown_mode"
      })
    });

    const { callGemini } = await import("../gemini-client");
    await expect(callGemini("今天很亂。", "亂")).rejects.toThrow(/mode/i);
  });

  it("throws when GEMINI_API_KEY env var is not set", async () => {
    delete process.env.GEMINI_API_KEY;

    const { callGemini } = await import("../gemini-client");
    await expect(callGemini("今天很亂。", "亂")).rejects.toThrow(/GEMINI_API_KEY/);
    expect(GoogleGenAIMock).not.toHaveBeenCalled();
    expect(generateContentMock).not.toHaveBeenCalled();
  });
});
