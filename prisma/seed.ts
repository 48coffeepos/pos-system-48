import { PrismaClient } from '../src/generated/prisma/client.js'
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

async function main() {
	console.log('🌱 Seeding database...')

	// ── Clear existing data ──

	await prisma.addonItem.deleteMany()
	await prisma.orderItem.deleteMany()
	await prisma.order.deleteMany()
	await prisma.addon.deleteMany()
	await prisma.menuInventory.deleteMany()
	await prisma.menu.deleteMany()
	await prisma.account.deleteMany()
	await prisma.role.deleteMany()
	await prisma.inventory.deleteMany()

	// ── Roles ──

	const adminRole = await prisma.role.create({ data: { name: 'admin' } })
	const staffRole = await prisma.role.create({ data: { name: 'staff' } })

	// ── Accounts ──

	await prisma.account.create({
		data: {
			role_id: adminRole.id,
			username: 'admin',
			password: 'admin123',
		},
	})

	await prisma.account.create({
		data: {
			role_id: staffRole.id,
			username: 'staff1',
			password: 'staff123',
		},
	})

	// ── Inventory ──

	const cup12Hot = await prisma.inventory.create({ data: { name: '12oz Hot', stock: 200, type: 'CUP' } })
	const cup12Iced = await prisma.inventory.create({ data: { name: '12oz Iced', stock: 200, type: 'CUP' } })
	const cup16Hot = await prisma.inventory.create({ data: { name: '16oz Hot', stock: 200, type: 'CUP' } })
	const cup16Iced = await prisma.inventory.create({ data: { name: '16oz Iced', stock: 200, type: 'CUP' } })
	const beans = await prisma.inventory.create({ data: { name: 'Coffee Beans', stock: 50, type: 'STANDALONE' } })

	// ── Menu Items ──

	const americano = await prisma.menu.create({
		data: {
			name: 'Americano',
			price: 130,
			category: 'coffee',
			type: 'CUP',
			inventory_items: {
				create: [
					{ inventory_id: cup12Hot.inventory_id, price: 130 },
					{ inventory_id: cup12Iced.inventory_id, price: 130 },
					{ inventory_id: cup16Iced.inventory_id, price: 140 },
				],
			},
		},
	})

	const latte = await prisma.menu.create({
		data: {
			name: 'Latte',
			price: 150,
			category: 'coffee',
			type: 'CUP',
			inventory_items: {
				create: [
					{ inventory_id: cup12Hot.inventory_id, price: 150 },
					{ inventory_id: cup12Iced.inventory_id, price: 150 },
					{ inventory_id: cup16Iced.inventory_id, price: 160 },
				],
			},
		},
	})

	const matchaLatte = await prisma.menu.create({
		data: {
			name: 'Matcha Latte',
			price: 160,
			category: 'non_coffee',
			type: 'CUP',
			inventory_items: {
				create: [
					{ inventory_id: cup12Hot.inventory_id, price: 160 },
					{ inventory_id: cup12Iced.inventory_id, price: 160 },
					{ inventory_id: cup16Iced.inventory_id, price: 170 },
				],
			},
		},
	})

	const hotChocolate = await prisma.menu.create({
		data: {
			name: 'Hot Chocolate',
			price: 140,
			category: 'hot',
			type: 'CUP',
			inventory_items: {
				create: [
					{ inventory_id: cup12Hot.inventory_id, price: 140 },
				],
			},
		},
	})

	const coconutLatte = await prisma.menu.create({
		data: {
			name: 'Coconut Latte',
			price: 150,
			category: 'coconut_milk',
			type: 'CUP',
			inventory_items: {
				create: [
					{ inventory_id: cup12Iced.inventory_id, price: 150 },
					{ inventory_id: cup16Iced.inventory_id, price: 160 },
				],
			},
		},
	})

	const milkteaCoffee = await prisma.menu.create({
		data: {
			name: 'Milktea Coffee',
			price: 160,
			category: 'milktea_x_coffee',
			type: 'CUP',
			inventory_items: {
				create: [
					{ inventory_id: cup12Iced.inventory_id, price: 160 },
					{ inventory_id: cup16Iced.inventory_id, price: 170 },
				],
			},
		},
	})

	const cookie = await prisma.menu.create({
		data: {
			name: 'Chocolate Chip Cookie',
			price: 75,
			category: 'extra',
			type: 'STANDALONE',
			inventory_items: {
				create: [
					{ inventory_id: beans.inventory_id, price: 75 },
				],
			},
		},
	})

	// ── Addons ──

	await prisma.addon.createMany({
		data: [
			{ name: 'Extra Shot', price: 25 },
			{ name: 'Vanilla Syrup', price: 20 },
			{ name: 'Caramel Sauce', price: 20 },
			{ name: 'Whipped Cream', price: 25 },
			{ name: 'Pearls', price: 20 },
		],
	})

	console.log('✅ Seeded roles, accounts, menu, addons, inventory')
}

main()
	.catch((e) => {
		console.error('❌ Error seeding database:', e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
