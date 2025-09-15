function cloneMidnight(d: Date): Date {
  const nd = new Date(d.getTime());
  nd.setHours(0, 0, 0, 0);
  return nd;
}

export function startOfMonth(d: Date): Date {
  const nd = new Date(d.getFullYear(), d.getMonth(), 1);
  nd.setHours(0, 0, 0, 0);
  return nd;
}

export function endOfMonth(d: Date): Date {
  // Day 0 of next month is the last day of this month
  const nd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  nd.setHours(23, 59, 59, 999);
  return nd;
}

// Sunday-based week start
export function startOfMonthGrid(d: Date): Date {
  const first = startOfMonth(d);
  const dow = first.getDay(); // 0=Sun..6=Sat
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - dow);
  gridStart.setHours(0, 0, 0, 0);
  return gridStart;
}

export function addDays(d: Date, n: number): Date {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + n);
  return nd;
}

export function addMonths(d: Date, n: number): Date {
  const nd = new Date(d);
  nd.setMonth(nd.getMonth() + n);
  return nd;
}

export function formatYYYYMM(d: Date): string {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const mm = m < 10 ? `0${m}` : String(m);
  return `${y}-${mm}`;
}

export function buildMonthGrid(d: Date): Date[] {
  const start = startOfMonthGrid(d);
  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) {
    cells.push(addDays(start, i));
  }
  return cells;
}

