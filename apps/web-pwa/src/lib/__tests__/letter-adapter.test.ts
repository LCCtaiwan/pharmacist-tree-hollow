import { describe, expect, it } from "vitest";
import type { ConversationResponse } from "@pharmacist-tree-hollow/shared";
import { staticToAILetter } from "../letter-adapter";

const normalStatic: ConversationResponse = {
  riskLevel: "normal",
  careTitle: "下班後還留在現場的腦袋",
  message: ["下班了，腦袋卻還留在工作裡。", "那不是你太放不下，是今天真的塞了太多責任。"],
  empathy: "下班後腦袋還留在工作裡，代表今天真的被塞得很滿。",
  praise: "你不是還不夠努力，是已經努力太久了。",
  praiseNotes: ["下班後腦袋還跟著轉，代表你今天接住了很多人。", "能說「太多」，是因為你看得見今天的重量。"],
  tinyAction: "先慢慢吐一口氣。",
  followupActions: []
};

const crisisStatic: ConversationResponse = {
  riskLevel: "crisis",
  message: ["先停一下。"],
  empathy: "你願意把這句話寫下來，本身就是一個願意停下來的訊號。",
  praise: "",
  tinyAction: "請打 1925 安心專線。",
  followupActions: []
};

describe("staticToAILetter", () => {
  it("把 normal ConversationResponse 轉成 hold_and_praise AILetterResponse", () => {
    const result = staticToAILetter(normalStatic);
    expect(result.mode).toBe("hold_and_praise");
    expect(result.careTitle).toBe("下班後還留在現場的腦袋");
    expect(result.hold).toContain("下班後腦袋還留在工作裡");
    expect(result.praise).toBe("你不是還不夠努力，是已經努力太久了。");
    expect(result.praiseNotes).toHaveLength(2);
  });

  it("沒有 careTitle 時用 fallback 標題", () => {
    const noCareTitle = { ...normalStatic, careTitle: undefined };
    const result = staticToAILetter(noCareTitle);
    expect(result.careTitle.length).toBeGreaterThan(0);
    expect(result.careTitle.length).toBeLessThanOrEqual(14);
  });

  it("crisis riskLevel 轉成 crisis mode", () => {
    const result = staticToAILetter(crisisStatic);
    expect(result.mode).toBe("crisis");
    expect(result.praise).toBe("");
    expect(result.praiseNotes).toEqual([]);
  });

  it("沒有 praiseNotes 時回空陣列", () => {
    const noPraiseNotes = { ...normalStatic, praiseNotes: undefined };
    const result = staticToAILetter(noPraiseNotes);
    expect(result.praiseNotes).toEqual([]);
  });

  it("careTitle 過長被截斷到 14 字", () => {
    const longTitle = { ...normalStatic, careTitle: "這個標題超過十四個中文字一定會被截斷" };
    const result = staticToAILetter(longTitle);
    expect([...result.careTitle].length).toBeLessThanOrEqual(14);
  });
});
