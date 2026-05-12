export type AILetterMode = "hold_and_praise" | "praise_only" | "hold_only" | "crisis";

export const VALID_MODES = [
  "hold_and_praise",
  "praise_only",
  "hold_only",
  "crisis"
] as const satisfies readonly AILetterMode[];

export interface AILetterResponse {
  mode: AILetterMode;
  careTitle: string;
  hold: string;
  praise: string;
  praiseNotes: string[];
}

const MAX_CARE_TITLE_LEN = 14;

function isRecord(data: unknown): data is Record<string, unknown> {
  return typeof data === "object" && data !== null;
}

function requireString(data: Record<string, unknown>, field: "careTitle" | "hold" | "praise"): string {
  if (typeof data[field] !== "string") {
    throw new Error(`missing ${field} (must be string)`);
  }

  return data[field];
}

export function validateAILetter(data: unknown): AILetterResponse {
  if (!isRecord(data)) {
    throw new Error("missing response object");
  }

  if (typeof data.mode !== "string") {
    throw new Error("missing mode (must be string)");
  }
  if (!VALID_MODES.includes(data.mode as AILetterMode)) {
    throw new Error(`invalid mode: ${data.mode}`);
  }

  const mode = data.mode as AILetterMode;
  const careTitle = requireString(data, "careTitle");
  if ([...careTitle].length > MAX_CARE_TITLE_LEN) {
    throw new Error(`careTitle too long (${[...careTitle].length} > ${MAX_CARE_TITLE_LEN})`);
  }

  const hold = requireString(data, "hold");
  const praise = mode === "hold_only" && data.praise === undefined ? "" : requireString(data, "praise");
  const praiseNotes =
    mode === "hold_only" && data.praiseNotes === undefined ? [] : data.praiseNotes;

  if (!Array.isArray(praiseNotes)) {
    throw new Error("praiseNotes must be array");
  }
  if (!praiseNotes.every((note) => typeof note === "string")) {
    throw new Error("praiseNotes must be array of strings");
  }

  return {
    mode,
    careTitle,
    hold,
    praise,
    praiseNotes
  };
}
