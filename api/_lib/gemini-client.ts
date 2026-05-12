import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { validateAILetter, type AILetterResponse } from "./schema";
import { SYSTEM_PROMPT } from "./system-prompt";

const AI_LETTER_RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    mode: {
      type: "STRING",
      enum: ["hold_and_praise", "praise_only", "hold_only", "crisis"]
    },
    careTitle: {
      type: "STRING",
      maxLength: "14"
    },
    hold: {
      type: "STRING"
    },
    praise: {
      type: "STRING"
    },
    praiseNotes: {
      type: "ARRAY",
      items: {
        type: "STRING"
      }
    }
  },
  required: ["mode", "careTitle", "hold", "praise", "praiseNotes"],
  propertyOrdering: ["mode", "careTitle", "hold", "praise", "praiseNotes"]
};

function buildUserMessage(input: string, mood: string): string {
  return `心情：${mood}\n紙條：${input}`;
}

const MAX_RETRIES = 3;
const BASE_BACKOFF_MS = 1500;

function isRetryableError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const status = (err as { status?: number }).status;
  if (status === 503 || status === 502 || status === 504 || status === 429) return true;
  const message = (err as { message?: string }).message ?? "";
  return /UNAVAILABLE|high demand|overloaded|timeout|empty response|not valid JSON/i.test(message);
}

export async function callGemini(input: string, mood: string): Promise<AILetterResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY env var is not set");
  }

  const client = new GoogleGenAI({ apiKey });

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await callGeminiOnce(client, input, mood);
    } catch (err) {
      if (attempt === MAX_RETRIES - 1 || !isRetryableError(err)) throw err;
      const backoff = BASE_BACKOFF_MS * Math.pow(2, attempt);
      await new Promise((r) => setTimeout(r, backoff));
    }
  }

  throw new Error("callGemini exhausted retries");
}

async function callGeminiOnce(
  client: GoogleGenAI,
  input: string,
  mood: string
): Promise<AILetterResponse> {
  const result = await client.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: AI_LETTER_RESPONSE_SCHEMA,
      temperature: 0.8,
      maxOutputTokens: 800,
      // 放寬安全濾鏡：藥師樹洞處理死亡/失去/壓力/危機等沉重內容，需要能回應這類紙條。
      // 系統 prompt 與前端 ai-safety 規則已限制輸出本身不會產生危險建議。
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH }
      ]
    },
    contents: [
      {
        role: "user",
        parts: [
          {
            text: buildUserMessage(input, mood)
          }
        ]
      }
    ]
  });

  if (typeof result.text !== "string") {
    throw new Error("Gemini response text is not valid JSON");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(result.text);
  } catch (error) {
    throw new Error("Gemini response text is not valid JSON", { cause: error });
  }

  return validateAILetter(parsed);
}
