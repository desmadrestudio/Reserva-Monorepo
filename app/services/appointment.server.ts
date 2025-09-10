import { prisma } from "~/lib/prisma.server";

export async function getAppointments({ start, end, shop }: { start: Date; end: Date; shop?: string }, db = prisma) {
  return db.appointment.findMany({
    where: {
      ...(shop ? { shop } : {}),
      date: { gte: start, lte: end },
    },
    orderBy: { date: "asc" },
  });
}

export async function createAppointment(
  {
    shop = "test-booking-spa",
    date,
    time,
    customer,
    providerId,
    service,
    notes,
  }: {
    shop?: string;
    date: Date;
    time: string;
    customer: string;
    providerId?: string;
    service?: string;
    notes?: string;
  },
  db = prisma
) {
  return db.appointment.create({
    data: {
      shop,
      date,
      time,
      customer,
      ...(providerId ? { providerId } : {}),
      service,
      notes,
    },
  });
}
