// app/db.server.ts
import { PrismaClient } from "@prisma/client";

// Allow global prisma reuse in development to avoid too many connections
declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

const prisma =
  process.env.NODE_ENV === "production"
    ? new PrismaClient()
    : global.prismaGlobal ?? (global.prismaGlobal = new PrismaClient());

export default prisma;