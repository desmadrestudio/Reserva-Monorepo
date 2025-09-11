/* prisma/seed.cjs */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Providers
  const provider = await prisma.provider.upsert({
    where: { id: 'prov-1' },
    update: {},
    create: { id: 'prov-1', name: 'Avery (LMT)' },
  });

  // Services
  const massage60 = await prisma.service.upsert({
    where: { id: 'svc-60' },
    update: {},
    create: { id: 'svc-60', name: '60-min Massage', category: 'Massage', price: 90 },
  });
  const massage90 = await prisma.service.upsert({
    where: { id: 'svc-90' },
    update: {},
    create: { id: 'svc-90', name: '90-min Massage', category: 'Massage', price: 120 },
  });

  // AddOns
  const hotStones = await prisma.addOn.upsert({
    where: { id: 'addon-stones' },
    update: {},
    create: { id: 'addon-stones', name: 'Hot Stones', price: 15 },
  });
  const aromatherapy = await prisma.addOn.upsert({
    where: { id: 'addon-aroma' },
    update: {},
    create: { id: 'addon-aroma', name: 'Aromatherapy', price: 10 },
  });
  const glassOfWine = await prisma.addOn.upsert({
    where: { id: 'addon-wine' },
    update: {},
    create: { id: 'addon-wine', name: 'Glass of Wine', price: 12 },
  });

  console.log('Seeded:', {
    provider: provider.name,
    services: [massage60.name, massage90.name],
    addOns: [hotStones.name, aromatherapy.name, glassOfWine.name],
  });
}

main().finally(async () => prisma.$disconnect());
