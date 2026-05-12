const KEY = "pharmacist-tree-hollow:disclosureSeen";

export function hasDisclosureSeen(): boolean {
  try {
    return typeof localStorage !== "undefined" && localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function markDisclosureSeen(): void {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(KEY, "1");
    }
  } catch {
    // noop
  }
}
