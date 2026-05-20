import { prisma } from '../src/integrations/prisma/db.js';


async function main() {
  // Clear existing data to avoid conflicts
  await prisma.menuInventory.deleteMany();
  await prisma.orderItemAddon.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.addon.deleteMany();
  await prisma.menu.deleteMany();
  await prisma.inventory.deleteMany();

  // Add some inventory items (cups and standalone items)
  const cup12 = await prisma.inventory.create({
    data: {
      name: '12oz hot',
      stock: 100,
      type: 'CUP',
    },
  });

  const cup16 = await prisma.inventory.create({
    data: {
      name: '16oz iced',
      stock: 100,
      type: 'CUP',
    },
  });

  const cookieInv = await prisma.inventory.create({
    data: {
      name: 'Chocolate Chip Cookie Inventory',
      stock: 50,
      type: 'STANDALONE',
    },
  });

  // Create menu items
  const menuLatte = await prisma.menu.create({
    data: {
      name: 'Latte',
      type: 'CUP',
    },
  });

  const menuMocha = await prisma.menu.create({
    data: {
      name: 'Mocha',
      type: 'CUP',
    },
  });

  const menuCookie = await prisma.menu.create({
    data: {
      name: 'Chocolate Chip Cookie',
      type: 'STANDALONE',
      price: 65,
    },
  });

  // Link Menu to Inventory
  await prisma.menuInventory.create({
    data: {
      menu_id: menuLatte.menu_id,
      inventory_id: cup12.inventory_id,
      price: 120,
    },
  });

  await prisma.menuInventory.create({
    data: {
      menu_id: menuLatte.menu_id,
      inventory_id: cup16.inventory_id,
      price: 140,
    },
  });

  await prisma.menuInventory.create({
    data: {
      menu_id: menuMocha.menu_id,
      inventory_id: cup12.inventory_id,
      price: 130,
    },
  });

  await prisma.menuInventory.create({
    data: {
      menu_id: menuMocha.menu_id,
      inventory_id: cup16.inventory_id,
      price: 150,
    },
  });

  await prisma.menuInventory.create({
    data: {
      menu_id: menuCookie.menu_id,
      inventory_id: cookieInv.inventory_id,
      price: 65,
    },
  });

  // Create addons
  await prisma.addon.createMany({
    data: [
      { name: 'Extra Shot', price: 30 },
      { name: 'Oat Milk', price: 40 },
      { name: 'Vanilla Syrup', price: 20 },
      { name: 'Caramel Syrup', price: 20 },
    ],
  });

  console.log('Seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
