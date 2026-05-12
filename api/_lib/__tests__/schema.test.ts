import { describe, expect, it } from "vitest";
import { validateAILetter, type AILetterResponse } from "../schema";

describe("validateAILetter", () => {
  it("accepts hold_and_praise mode with all fields", () => {
    const input = {
      mode: "hold_and_praise",
      careTitle: "那段對話沒打中你",
      hold: "那句話刮得很用力。今晚還在你身上沒散。",
      praise: "你撐住了現場，這不是運氣。",
      praiseNotes: ["你沒把情緒丟回去。", "你把說明留在流程裡。"]
    };

    expect(() => validateAILetter(input)).not.toThrow();
    const result: AILetterResponse = validateAILetter(input);
    expect(result.mode).toBe("hold_and_praise");
  });

  it("accepts praise_only with hold as an empty string", () => {
    const input = {
      mode: "praise_only",
      careTitle: "沒被淹掉的一天",
      hold: "",
      praise: "你能說沒被淹掉，代表今天有在數浪頭。",
      praiseNotes: ["平穩來自很多小判斷。"]
    };

    expect(() => validateAILetter(input)).not.toThrow();
  });

  it("accepts hold_only with praise and praiseNotes empty or absent", () => {
    const inputWithEmptyPraise = {
      mode: "hold_only",
      careTitle: "今晚先放在紙上",
      hold: "這種重，不需要急著被整理。",
      praise: "",
      praiseNotes: []
    };
    const inputWithAbsentPraise = {
      mode: "hold_only",
      careTitle: "今晚先放在紙上",
      hold: "這種重，不需要急著被整理。"
    };

    expect(() => validateAILetter(inputWithEmptyPraise)).not.toThrow();
    expect(validateAILetter(inputWithAbsentPraise).praise).toBe("");
    expect(validateAILetter(inputWithAbsentPraise).praiseNotes).toEqual([]);
  });

  it("rejects missing required fields", () => {
    const input = { mode: "hold_and_praise", careTitle: "缺欄位" };

    expect(() => validateAILetter(input)).toThrow(/missing/i);
  });

  it("rejects unknown mode", () => {
    const input = {
      mode: "unknown_mode",
      careTitle: "x",
      hold: "",
      praise: "x",
      praiseNotes: []
    };

    expect(() => validateAILetter(input)).toThrow(/mode/i);
  });

  it("rejects careTitle over 14 codepoints", () => {
    const input = {
      mode: "praise_only",
      careTitle: "這個標題明顯太長了一定會被攔下來真的",
      hold: "",
      praise: "x",
      praiseNotes: []
    };

    expect(() => validateAILetter(input)).toThrow(/careTitle/i);
  });

  it("rejects praiseNotes not an array", () => {
    const input = {
      mode: "praise_only",
      careTitle: "x",
      hold: "",
      praise: "x",
      praiseNotes: "not an array"
    };

    expect(() => validateAILetter(input)).toThrow(/praiseNotes/i);
  });
});
