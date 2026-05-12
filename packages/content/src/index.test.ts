import { describe, expect, it } from "vitest";
import { astroCards, getCombinedReading, microTools, songs } from "./index";

describe("content pools", () => {
  it("contains exactly 50 MVP song recommendations", () => {
    expect(songs).toHaveLength(50);
  });

  it("stores song metadata without lyric fields", () => {
    expect(songs.every((song) => "title" in song && "artist" in song && "reason" in song)).toBe(true);
    expect(songs.some((song) => "lyrics" in song)).toBe(false);
  });

  it("contains the agreed MVP micro tools and astro cards", () => {
    expect(microTools).toHaveLength(5);
    expect(astroCards).toHaveLength(14);
    expect(astroCards.every((card) => typeof card.healingTip === "string" && card.healingTip.length > 0)).toBe(true);
  });

  it("uses short astro card text", () => {
    expect(astroCards.every((card) => card.lines.length >= 2 && card.lines.length <= 4)).toBe(true);
  });

  it("builds a combined astro reading from repeated scenario tags", () => {
    expect(getCombinedReading([astroCards[1], astroCards[5], astroCards[13]])).toBe("今晚整體都在『下班還沒回家』的階段。");
  });

  it("falls back when three astro cards have no repeated scenario tag", () => {
    expect(getCombinedReading([astroCards[0], astroCards[3], astroCards[4]])).toBe("今晚是雜的，雜也是一種真實。");
  });
});
