import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AILetterResponse } from "@pharmacist-tree-hollow/shared";
import { ResponseCard } from "./ResponseCard";

function createLocalStorageMock(): Storage {
  const data = new Map<string, string>();

  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key: string) => data.get(key) ?? null,
    key: (index: number) => Array.from(data.keys())[index] ?? null,
    removeItem: (key: string) => data.delete(key),
    setItem: (key: string, value: string) => data.set(key, value)
  };
}

const aiLetter: AILetterResponse = {
  mode: "hold_and_praise",
  careTitle: "那段對話的重量",
  hold: "那句話刮得很用力。今晚還在你身上沒散。",
  praise: "你撐住了現場，這不是運氣。",
  praiseNotes: [
    "你沒把對方的情緒丟回去。",
    "你把說明留在流程裡。"
  ]
};

describe("ResponseCard", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", createLocalStorageMock());
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  it("信件主結構：stamp + careTitle + hold + praise + 延伸 + 燈還亮著", () => {
    const html = renderToStaticMarkup(
      <ResponseCard letter={aiLetter} onSave={() => undefined} onNewNote={() => undefined} />
    );
    expect(html).toContain("樹洞回信");
    expect(html).toContain("那段對話的重量");
    expect(html).toContain("那句話刮得很用力");
    expect(html).toContain("你撐住了現場");
    expect(html).toContain("你沒把對方的情緒丟回去。");
    expect(html).toContain("你把說明留在流程裡。");
    expect(html).toContain("燈還亮著");
  });

  it("顯示 AI 揭露文案", () => {
    const html = renderToStaticMarkup(
      <ResponseCard letter={aiLetter} onSave={() => undefined} onNewNote={() => undefined} />
    );
    expect(html).toContain("樹洞回信由 AI 協助撰寫");
  });

  it("praise_only：無 hold、有 praise", () => {
    const praiseOnly: AILetterResponse = {
      mode: "praise_only",
      careTitle: "沒被淹掉的一天",
      hold: "",
      praise: "你能說沒淹水，代表今天有在數浪頭。",
      praiseNotes: ["平穩來自很多小判斷。"]
    };
    const html = renderToStaticMarkup(
      <ResponseCard letter={praiseOnly} onSave={() => undefined} onNewNote={() => undefined} />
    );
    expect(html).toContain("你能說沒淹水");
    expect(html).toContain("沒被淹掉的一天");
  });

  it("hold_only：有 hold、無 praise / praiseNotes", () => {
    const holdOnly: AILetterResponse = {
      mode: "hold_only",
      careTitle: "今晚先放在紙上",
      hold: "這種重量，不需要急著被整理。",
      praise: "",
      praiseNotes: []
    };
    const html = renderToStaticMarkup(
      <ResponseCard letter={holdOnly} onSave={() => undefined} onNewNote={() => undefined} />
    );
    expect(html).toContain("這種重量");
    expect(html).not.toContain("letter-praise-extend");
  });

  it("舊欄位不再出現（tinyAction/gentleQuestion/closingLine 已被移除）", () => {
    const html = renderToStaticMarkup(
      <ResponseCard letter={aiLetter} onSave={() => undefined} onNewNote={() => undefined} />
    );
    expect(html).not.toContain("先慢慢吐一口氣");
    expect(html).not.toContain("最想先放下哪一幕");
    expect(html).not.toContain("信中的小貼");
    expect(html).not.toContain("再誇我一句");
    expect(html).not.toContain("— 樹洞");
  });

  it("第二封信不再顯示揭露文案（已看過）", () => {
    localStorage.setItem("pharmacist-tree-hollow:disclosureSeen", "1");
    const html = renderToStaticMarkup(
      <ResponseCard letter={aiLetter} onSave={() => undefined} onNewNote={() => undefined} />
    );
    expect(html).not.toContain("樹洞回信由 AI 協助撰寫");
  });
});
