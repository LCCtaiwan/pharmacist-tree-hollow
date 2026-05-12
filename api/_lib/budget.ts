export function isBudgetExhausted(): boolean {
  const cutoffRaw = process.env.BUDGET_HARD_CUTOFF_DATE;
  if (!cutoffRaw) return false;
  const cutoff = new Date(cutoffRaw);
  if (Number.isNaN(cutoff.getTime())) return false;
  return cutoff.getTime() < Date.now();
}
