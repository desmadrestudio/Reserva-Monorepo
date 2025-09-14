export function dollarsToCents(value: number | string): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? Math.round(value * 100) : 0;
  }
  const cleaned = value.replace(/[^0-9.\-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

export function centsToDollars(cents: number): number {
  const n = Number(cents ?? 0);
  return Number.isFinite(n) ? n / 100 : 0;
}

