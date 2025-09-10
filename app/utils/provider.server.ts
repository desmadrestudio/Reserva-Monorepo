// utils/provider.server.ts
import { prisma } from "~/lib/prisma.server";

export async function getProviders() {
    const dbProviders = await prisma.provider.findMany();
    return dbProviders.map((p) => ({
        label: p.name,
        value: p.id,
    }));
}