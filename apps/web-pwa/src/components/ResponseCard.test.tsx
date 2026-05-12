import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { ConversationResponse } from "@pharmacist-tree-hollow/shared";
import { ResponseCard } from "./ResponseCard";

const normalResponse: ConversationResponse = {
  riskLevel: "normal",
  careTitle: "一格一格確認的重量",
  message: ["交班和紀錄一直追著跑。", "你願意回到流程，是在替後面的人守門。"],
  empathy: "交班和紀錄一直追著跑。",
  praise: "那些沒有人稱讚的確認，其實都在保護後面的人。",
  praiseNotes: ["那些沒有人稱讚的確認，其實都在保護後面的人。"],
  tinyAction: "先把下一個可確認的欄位做好就好。",
  gentleQuestion: "下一個最小欄位是什麼？",
  closingLine: "今晚先不用把所有格子都放進腦袋裡。",
  followupActions: [],
  astro: {
    id: "astro-saturn",
    name: "土星的邊界",
    lines: ["你不用替所有混亂負責。", "先把能確認的確認好，", "剩下的，交回流程和團隊。"],
    scenarioTags: ["shortage_pressure", "inventory_control", "team_doubt"],
    healingTip: "列出今晚確認過的3件事，提醒自己有把關。"
  }
};

describe("ResponseCard", () => {
  it("renders the response as a handwritten letter", () => {
    const html = renderToStaticMarkup(
      <ResponseCard
        response={normalResponse}
        onSave={() => undefined}
        onNewNote={() => undefined}
      />
    );

    // 信件結構（極簡化：信頭 + 段落 + 誇誇 + 燈還亮著署名）
    expect(html).toContain("樹洞回信");
    expect(html).toContain("一格一格確認的重量");
    expect(html).toContain("交班和紀錄一直追著跑。");
    expect(html).toContain("那些沒有人稱讚的確認，其實都在保護後面的人。");
    expect(html).toContain("燈還亮著");
    expect(html).toContain("收下這封信");
    expect(html).toContain("再投一張紙條");
    // 已移除的元素：tinyAction、gentleQuestion、closingLine、healingTip、再誇我一句、— 樹洞 footer
    expect(html).not.toContain("先把下一個可確認的欄位做好就好。");
    expect(html).not.toContain("下一個最小欄位是什麼？");
    expect(html).not.toContain("今晚先不用把所有格子");
    expect(html).not.toContain("信中的小貼");
    expect(html).not.toContain("列出今晚確認過的3件事");
    expect(html).not.toContain("再誇我一句");
    expect(html).not.toContain("— 樹洞");
    // aftercare drawer 已移除
    expect(html).not.toContain("還想留一下");
    expect(html).not.toContain("接著可以選一個");
  });
});
