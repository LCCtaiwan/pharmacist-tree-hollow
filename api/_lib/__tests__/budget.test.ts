import { afterEach, describe, expect, it, vi } from "vitest";
import { isBudgetExhausted } from "../budget";

describe("isBudgetExhausted", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns false when BUDGET_HARD_CUTOFF_DATE is not set", () => {
    vi.stubEnv("BUDGET_HARD_CUTOFF_DATE", undefined);

    expect(isBudgetExhausted()).toBe(false);
  });

  it("returns false when BUDGET_HARD_CUTOFF_DATE is in the future", () => {
    vi.stubEnv("BUDGET_HARD_CUTOFF_DATE", "2099-12-31");

    expect(isBudgetExhausted()).toBe(false);
  });

  it("returns true when BUDGET_HARD_CUTOFF_DATE is in the past", () => {
    vi.stubEnv("BUDGET_HARD_CUTOFF_DATE", "2020-01-01");

    expect(isBudgetExhausted()).toBe(true);
  });
});
