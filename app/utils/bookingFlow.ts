// /app/utils/bookingFlow.ts

import { BOOKING_FLOW } from "~/config/bookingFlow";
import { prisma } from "../lib/prisma.server";

// Step Flow Logic
export function getNextStep(currentStep: string): string | null {
  const index = BOOKING_FLOW.indexOf(currentStep);
  if (index === -1 || index === BOOKING_FLOW.length - 1) return null;
  return BOOKING_FLOW[index + 1];
}

export function isStepEnabled(step: string): boolean {
  return BOOKING_FLOW.includes(step);
}

// Check if slot is already booked
export async function isSlotBooked({
  providerId,
  time,
  date,
}: {
  providerId: string;
  time: string;
  date: Date;
}) {
  return await prisma.appointment.findFirst({
    where: {
      providerId,
      time,
      date: {
        gte: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0),
        lte: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999),
      },
    },
  });
}

// Create appointment
export async function createAppointment({
  providerId,
  time,
  customer,
  service,
  date,
}: {
  providerId: string;
  time: string;
  customer: string;
  service?: string;
  date: Date;
}) {
  return await prisma.appointment.create({
    data: {
      providerId,
      time,
      customer,
      service,
      date,
      shop: "test-booking-spa", // Replace with dynamic shop if needed
    },
  });
}