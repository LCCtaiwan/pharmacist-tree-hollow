import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { hasDisclosureSeen, markDisclosureSeen } from "../disclosure";

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

describe("disclosure", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", createLocalStorageMock());
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  it("第一次 hasDisclosureSeen 回 false", () => {
    expect(hasDisclosureSeen()).toBe(false);
  });

  it("markDisclosureSeen 後 hasDisclosureSeen 回 true", () => {
    markDisclosureSeen();
    expect(hasDisclosureSeen()).toBe(true);
  });
});
