const KEY = "pharmacist-tree-hollow:lastLetterDate";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function hasUsedLetterToday(): boolean {
  try {
    if (typeof localStorage === "undefined") return false;
    return localStorage.getItem(KEY) === today();
  } catch {
    return false;
  }
}

export function markLetterSent(): void {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(KEY, today());
  } catch {
    // localStorage 不可用時 silently noop
  }
}
