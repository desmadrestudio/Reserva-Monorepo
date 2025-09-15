import { prisma } from "~/lib/prisma.server";

type GetSlotsArgs = {
  serviceId: string;
  staffId?: string;
  startDate: Date; // local date
  days: number; // how many days to compute
  stepMinutes: number; // increment step for slots (e.g., 60)
};

function addMinutes(d: Date, mins: number) {
  return new Date(d.getTime() + mins * 60_000);
}

export async function getSlots({ serviceId, staffId, startDate, days, stepMinutes }: GetSlotsArgs) {
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { baseMinutes: true, processingMinutes: true, blockExtraMinutes: true },
  });
  if (!service) return [] as { start: Date; end: Date }[];

  const totalMinutes = (service.baseMinutes ?? 0) + (service.processingMinutes ?? 0) + (service.blockExtraMinutes ?? 0);
  const result: { start: Date; end: Date }[] = [];

  for (let i = 0; i < days; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    const dow = day.getDay(); // 0=Sun

    const biz = await prisma.businessHour.findMany({ where: { dow } });
    const staffHours = staffId ? await prisma.staffHour.findMany({ where: { staffId, dow } }) : [];

    // Build open windows: intersect staffHours with business hours if staff provided
    const windows: Array<{ open: number; close: number }> = [];
    const baseWindows = biz.map((b) => ({ open: b.openMinutes, close: b.closeMinutes }));
    if (staffId) {
      for (const s of staffHours) {
        for (const w of baseWindows) {
          const open = Math.max(w.open, s.openMinutes);
          const close = Math.min(w.close, s.closeMinutes);
          if (open < close) windows.push({ open, close });
        }
      }
    } else {
      windows.push(...baseWindows);
    }

    // For each window, step by stepMinutes and ensure service fits
    for (const w of windows) {
      for (let m = w.open; m + totalMinutes <= w.close; m += stepMinutes) {
        const start = new Date(day);
        start.setHours(0, 0, 0, 0);
        const startTime = new Date(start.getTime() + m * 60_000);
        const endTime = new Date(start.getTime() + (m + totalMinutes) * 60_000);
        result.push({ start: startTime, end: endTime });
      }
    }
  }

  return result;
}

