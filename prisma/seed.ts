import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed one staff member if none
  const staffCount = await prisma.staff.count();
  if (staffCount === 0) {
    await prisma.staff.create({ data: { name: "Alex" } });
  }

  // Seed business hours 9–5 Mon–Fri if none
  const bhCount = await prisma.businessHour.count();
  if (bhCount === 0) {
    const days = [1, 2, 3, 4, 5]; // Mon-Fri
    await prisma.$transaction(
      days.map((dow) =>
        prisma.businessHour.create({ data: { dow, openMinutes: 9 * 60, closeMinutes: 17 * 60 } })
      )
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

