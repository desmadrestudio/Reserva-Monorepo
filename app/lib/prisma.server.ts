import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

declare global {
  // ✅ Use a global cache to avoid creating multiple instances in dev
  var __prisma__: PrismaClient | undefined;
}

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.__prisma__) {
    global.__prisma__ = new PrismaClient();
  }
  prisma = global.__prisma__;
}

export { prisma };