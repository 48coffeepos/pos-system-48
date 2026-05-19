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
	await prisma.menu.deleteMany()
	await prisma.account.deleteMany()
	await prisma.role.deleteMany()
	await prisma.expenses.deleteMany()
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

	// ── Menu Items ──

	const americano = await prisma.menu.create({
		data: {
			name: 'Americano',
			price: 130,
			category: 'coffee',
			temperatures: ['HOT', 'ICED'],
			hot_cup_sizes: [12, 16],
			iced_cup_sizes: [12, 16],
			hot_12oz_price: 130,
			hot_16oz_price: 140,
			iced_12oz_price: 130,
			iced_16oz_price: 140,
		},
	})

	const latte = await prisma.menu.create({
		data: {
			name: 'Latte',
			price: 150,
			category: 'coffee',
			temperatures: ['HOT', 'ICED'],
			hot_cup_sizes: [12, 16],
			iced_cup_sizes: [12, 16],
			hot_12oz_price: 150,
			hot_16oz_price: 160,
			iced_12oz_price: 150,
			iced_16oz_price: 160,
		},
	})

	const matchaLatte = await prisma.menu.create({
		data: {
			name: 'Matcha Latte',
			price: 160,
			category: 'non_coffee',
			temperatures: ['HOT', 'ICED'],
			hot_cup_sizes: [12, 16],
			iced_cup_sizes: [12, 16],
			hot_12oz_price: 160,
			hot_16oz_price: 170,
			iced_12oz_price: 160,
			iced_16oz_price: 170,
		},
	})

	const hotChocolate = await prisma.menu.create({
		data: {
			name: 'Hot Chocolate',
			price: 140,
			category: 'hot',
			temperatures: ['HOT'],
			hot_cup_sizes: [12, 16],
			iced_cup_sizes: [],
			hot_12oz_price: 140,
			hot_16oz_price: 150,
			iced_12oz_price: 0,
			iced_16oz_price: 0,
		},
	})

	const coconutLatte = await prisma.menu.create({
		data: {
			name: 'Coconut Latte',
			price: 150,
			category: 'coconut_milk',
			temperatures: ['ICED'],
			hot_cup_sizes: [],
			iced_cup_sizes: [12, 16],
			hot_12oz_price: 0,
			hot_16oz_price: 0,
			iced_12oz_price: 150,
			iced_16oz_price: 160,
		},
	})

	const milkteaCoffee = await prisma.menu.create({
		data: {
			name: 'Milktea Coffee',
			price: 160,
			category: 'milktea_x_coffee',
			temperatures: ['ICED'],
			hot_cup_sizes: [],
			iced_cup_sizes: [12, 16],
			hot_12oz_price: 0,
			hot_16oz_price: 0,
			iced_12oz_price: 160,
			iced_16oz_price: 170,
		},
	})

	const cookie = await prisma.menu.create({
		data: {
			name: 'Chocolate Chip Cookie',
			price: 75,
			category: 'extra',
			temperatures: [],
			hot_cup_sizes: [],
			iced_cup_sizes: [],
			hot_12oz_price: 0,
			hot_16oz_price: 0,
			iced_12oz_price: 0,
			iced_16oz_price: 0,
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

	// ── Expenses Sample ──

	await prisma.expenses.createMany({
		data: [
			{
				description: 'Electric bill',
				amount: 2500,
				type: 'utility',
				date: new Date(),
			},
			{
				description: 'Coffee beans delivery',
				amount: 4500,
				type: 'supply',
				date: new Date(),
			},
		],
	})

	// ── Inventory ──

	await prisma.inventory.createMany({
		data: [
			{ name: '12oz Hot', stock: 200, type: 'CUP' },
			{ name: '12oz Iced', stock: 200, type: 'CUP' },
			{ name: '16oz Hot', stock: 200, type: 'CUP' },
			{ name: '16oz Iced', stock: 200, type: 'CUP' },
			{ name: 'Coffee Beans', stock: 50, type: 'STANDALONE' },
		],
	})

	console.log('✅ Seeded roles, accounts, menu, addons, expenses, inventory')
}

main()
	.catch((e) => {
		console.error('❌ Error seeding database:', e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
