export function parseOdds(
  value: string,
  format: "decimal" | "american",
): number | null {
  if (!value.trim()) return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  if (format === "decimal") return n > 1 ? n : null;
  return Math.abs(n) >= 100
    ? n > 0
      ? 1 + n / 100
      : 1 + 100 / Math.abs(n)
    : null;
}
export function allocate(a: number, b: number, budget: number) {
  if (![a, b, budget].every(Number.isFinite) || a <= 1 || b <= 1 || budget <= 0)
    return null;
  const probability = 1 / a + 1 / b;
  const first = Math.round((budget / a / probability) * 100) / 100;
  const second = Math.round((budget - first) * 100) / 100;
  const payout = Math.min(first * a, second * b);
  return {
    stakes: [first, second],
    payout,
    profit: payout - budget,
    roi: (payout / budget - 1) * 100,
    probability,
  };
}
