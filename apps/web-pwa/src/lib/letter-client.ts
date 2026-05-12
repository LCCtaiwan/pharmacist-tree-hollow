import type { AILetterResponse, MoodTag } from "@pharmacist-tree-hollow/shared";
import { staticToAILetter } from "./letter-adapter";
import { buildResponse } from "./respond";

export type LetterSource = "ai" | "fallback";

export type LetterResult = {
  letter: AILetterResponse;
  source: LetterSource;
};

export class RateLimitedError extends Error {
  constructor() {
    super("rate_limit");
    this.name = "RateLimitedError";
  }
}

function looksLikeAILetter(data: unknown): data is AILetterResponse {
  if (typeof data !== "object" || data === null) return false;

  const candidate = data as Partial<AILetterResponse>;
  return (
    typeof candidate.mode === "string" &&
    typeof candidate.careTitle === "string" &&
    typeof candidate.hold === "string" &&
    typeof candidate.praise === "string" &&
    Array.isArray(candidate.praiseNotes)
  );
}

function fallback(input: string, mood: string): LetterResult {
  const staticResponse = buildResponse(input, mood as MoodTag);
  return {
    letter: staticToAILetter(staticResponse),
    source: "fallback"
  };
}

export async function requestAILetter(input: string, mood: string): Promise<LetterResult> {
  try {
    const response = await fetch("/api/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input, mood })
    });

    if (response.status === 429) {
      throw new RateLimitedError();
    }

    if (!response.ok) return fallback(input, mood);

    const parsed: unknown = await response.json();
    if (!looksLikeAILetter(parsed)) return fallback(input, mood);

    return {
      letter: parsed,
      source: "ai"
    };
  } catch (err) {
    if (err instanceof RateLimitedError) throw err;
    return fallback(input, mood);
  }
}
