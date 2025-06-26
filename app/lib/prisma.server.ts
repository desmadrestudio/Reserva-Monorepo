import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma =
  process.env.NODE_ENV === "production"
    ? new PrismaClient()
    : global.prismaGlobal ?? (global.prismaGlobal = new PrismaClient());
