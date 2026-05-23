import { prisma } from './src/integrations/prisma/db.js';

async function main() {
  const menus = await prisma.menu.findMany({
    include: {
      inventory_items: {
        include: {
          inventory: true,
        },
      },
    },
  });
  console.log('Menus:', JSON.stringify(menus, null, 2));

  const addons = await prisma.addon.findMany();
  console.log('Addons:', JSON.stringify(addons, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
