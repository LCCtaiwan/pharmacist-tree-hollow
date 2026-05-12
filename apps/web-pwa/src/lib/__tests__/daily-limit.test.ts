import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { hasUsedLetterToday, markLetterSent } from "../daily-limit";

const KEY = "pharmacist-tree-hollow:lastLetterDate";

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

describe("daily-limit", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", createLocalStorageMock());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("第一次進來：hasUsedLetterToday 回 false", () => {
    expect(hasUsedLetterToday()).toBe(false);
  });

  it("markLetterSent 寫入今天日期、hasUsedLetterToday 回 true", () => {
    markLetterSent();
    expect(hasUsedLetterToday()).toBe(true);
  });

  it("如果 localStorage 存的是昨天日期、hasUsedLetterToday 回 false", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    localStorage.setItem(KEY, yesterday.toISOString().slice(0, 10));
    expect(hasUsedLetterToday()).toBe(false);
  });

  it("如果 localStorage 不可用、silently allow（回 false）", () => {
    vi.stubGlobal("localStorage", undefined);
    expect(hasUsedLetterToday()).toBe(false);
    expect(() => markLetterSent()).not.toThrow();
  });
});
