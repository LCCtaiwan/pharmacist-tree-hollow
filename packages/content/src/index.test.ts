import { describe, expect, it } from "vitest";
import { astroCards, healingCards, microTools, songs } from "./index";

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
    expect(healingCards.length).toBeGreaterThanOrEqual(5);
  });

  it("uses short astro card text", () => {
    expect(astroCards.every((card) => card.lines.length >= 2 && card.lines.length <= 4)).toBe(true);
  });
});
