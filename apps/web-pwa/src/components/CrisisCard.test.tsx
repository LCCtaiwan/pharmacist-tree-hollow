import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { AILetterResponse } from "@pharmacist-tree-hollow/shared";
import { CrisisCard } from "./CrisisCard";

const crisisLetter: AILetterResponse = {
  mode: "crisis",
  careTitle: "先讓人陪著你",
  hold: "這句話很重。今晚先不要一個人扛著它。",
  praise: "",
  praiseNotes: []
};

describe("CrisisCard", () => {
  it("顯示 hold 接住文字", () => {
    const html = renderToStaticMarkup(
      <CrisisCard letter={crisisLetter} onNewNote={() => undefined} />
    );
    expect(html).toContain("這句話很重");
    expect(html).toContain("先讓人陪著你");
  });

  it("顯示 1925 / 1995 / 1980 三個專業資源", () => {
    const html = renderToStaticMarkup(
      <CrisisCard letter={crisisLetter} onNewNote={() => undefined} />
    );
    expect(html).toContain("1925");
    expect(html).toContain("1995");
    expect(html).toContain("1980");
  });

  it("提供再投一張紙條的按鈕", () => {
    const html = renderToStaticMarkup(
      <CrisisCard letter={crisisLetter} onNewNote={() => undefined} />
    );
    expect(html).toContain("再投一張紙條");
  });

  it("不顯示誇誇相關元素", () => {
    const html = renderToStaticMarkup(
      <CrisisCard letter={crisisLetter} onNewNote={() => undefined} />
    );
    expect(html).not.toContain("收下這封信");
    expect(html).not.toContain("praise-notes");
  });
});
