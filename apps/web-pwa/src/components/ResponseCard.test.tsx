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
  microTool: {
    id: "handoff-breath",
    title: "交班後鬆一下",
    scenarioTags: ["inventory_control"],
    durationSeconds: 30,
    steps: ["把肩膀放低一點。"],
    completionText: "先這樣就好。"
  },
  followupActions: ["song", "card", "astro"],
  song: {
    title: "下班路",
    artist: "測試歌手",
    language: "zh-TW",
    moodTags: ["累"],
    scenarioTags: ["inventory_control"],
    energy: "soft",
    timing: ["after_shift"],
    reason: "讓腦袋慢慢降速。"
  },
  card: {
    id: "boundary",
    name: "邊界",
    meaning: "不是所有情緒都該由你承擔。",
    reflection: "哪一小塊可以交回流程或團隊？"
  },
  astro: {
    id: "moon",
    name: "月亮",
    lines: ["今天先照顧自己的節奏。"],
    scenarioTags: ["inventory_control"]
  }
};

describe("ResponseCard", () => {
  it("shows followup choices immediately after a normal response", () => {
    const html = renderToStaticMarkup(
      <ResponseCard
        response={normalResponse}
        activePanel={null}
        onPanel={() => undefined}
        onSave={() => undefined}
        onNewNote={() => undefined}
      />
    );

    expect(html).toContain("收下回信");
    expect(html).toContain("小燈");
    expect(html).toContain("收音機");
    expect(html).toContain("紙籤盒");
    expect(html).toContain("窗邊星光");
    expect(html).not.toContain("還想留一下");
  });
});
