import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const oculos = await prisma.inventory.create({
    data: {
      name: 'Oculos da Osklen',
      points: 10,
      slug: 'oculos-da-osklen',
      enabled: true,
    },
  });
  const requestOculos = await prisma.product.create({
    data: {
      enabled: true,
      inventoryId: oculos.id,
      requestingUserId: 'randomid',
      status: 'IN_ANALYSIS',
    },
  });
  console.log({ oculos, requestOculos });
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
