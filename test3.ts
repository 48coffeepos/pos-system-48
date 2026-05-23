import { prisma } from './src/integrations/prisma/db.js';

async function main() {
  const [dbMenuItems, dbAddOns] = await Promise.all([
    prisma.menu.findMany({
      orderBy: { name: "asc" },
      include: {
        inventory_items: {
          include: {
            inventory: true,
          },
        },
      },
    }),
    prisma.addon.findMany({ orderBy: { name: "asc" } }),
  ]);

  const menuItems = dbMenuItems.map((item) => ({
    menu_id: item.menu_id,
    name: item.name,
    price: item.price ? Number(item.price) : null,
    type: item.type,
    inventory_items: item.inventory_items.map((ii) => ({
      price: Number(ii.price),
      inventory: {
        inventory_id: ii.inventory.inventory_id,
        name: ii.inventory.name,
        stock: ii.inventory.stock,
        type: ii.inventory.type,
      },
    })),
  }));

  const addOns = dbAddOns.map((a) => ({
    addon_id: a.addon_id,
    name: a.name,
    price: Number(a.price),
  }));

  console.log(JSON.stringify({ menuItems, addOns }, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
