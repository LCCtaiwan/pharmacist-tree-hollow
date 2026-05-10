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
  followupActions: []
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

    // 信件結構
    expect(html).toContain("樹洞回信");
    expect(html).toContain("一格一格確認的重量");
    expect(html).toContain("交班和紀錄一直追著跑。");
    expect(html).toContain("那些沒有人稱讚的確認，其實都在保護後面的人。");
    expect(html).toContain("先把下一個可確認的欄位做好就好。");
    expect(html).toContain("— 樹洞");
    expect(html).toContain("收下這封信");
    expect(html).toContain("再投一張紙條");
    // aftercare drawer 已移除
    expect(html).not.toContain("還想留一下");
    expect(html).not.toContain("接著可以選一個");
  });
});
