import { GoogleGenAI } from "@google/genai";
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

export async function callGemini(input: string, mood: string): Promise<AILetterResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY env var is not set");
  }

  const client = new GoogleGenAI({ apiKey });
  const result = await client.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: AI_LETTER_RESPONSE_SCHEMA,
      temperature: 0.8,
      maxOutputTokens: 800
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
