import { PrismaNeon } from "@prisma/adapter-neon";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, username } from "better-auth/plugins";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaNeon({
	connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	emailAndPassword: {
		enabled: true,
	},
	plugins: [admin(), username()],
	experimental: {
		joins: true,
	},
});

async function seedAdmin() {
	const email = process.env.EMAIL;
	const password = process.env.PASS;

	if (!email || !password) {
		console.error("❌ EMAIL and PASS environment variables are required");
		process.exit(1);
	}

	await prisma.user.deleteMany();

	const existingAdmin = await prisma.user.findFirst({
		where: { email: email },
	});

	if (!existingAdmin) {
		const result = await auth.api.createUser({
			body: {
				email,
				password,
				name: "Admin",
				role: "admin",
				data: {
					username: "admin",
					displayUsername: "admin",
					emailVerified: true,
				},
			},
		});

		if ("user" in result && result.user) {
			await prisma.user.update({
				where: { id: result.user.id },
				data: { role: "admin" },
			});
			console.log(`✅ Created admin user: ${email} / ${password}`);
		} else if ("error" in result) {
			console.error("❌ Failed to create admin:", result.error);
		}
	} else {
		console.log("✅ Admin user already exists");
	}
}

async function seedPosData() {
	await prisma.menuInventory.deleteMany();
	await prisma.orderItemAddon.deleteMany();
	await prisma.orderItem.deleteMany();
	await prisma.addon.deleteMany();
	await prisma.menu.deleteMany();
	await prisma.inventory.deleteMany();

	const cup12 = await prisma.inventory.create({
		data: { name: "12oz hot", stock: 100, type: "CUP" },
	});

	const cup16 = await prisma.inventory.create({
		data: { name: "16oz iced", stock: 100, type: "CUP" },
	});

	const cookieInv = await prisma.inventory.create({
		data: {
			name: "Chocolate Chip Cookie Inventory",
			stock: 50,
			type: "STANDALONE",
		},
	});

	const menuLatte = await prisma.menu.create({
		data: { name: "Latte", type: "CUP" },
	});

	const menuMocha = await prisma.menu.create({
		data: { name: "Mocha", type: "CUP" },
	});

	const menuCookie = await prisma.menu.create({
		data: { name: "Chocolate Chip Cookie", type: "STANDALONE", price: 65 },
	});

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

	await prisma.addon.createMany({
		data: [
			{ name: "Extra Shot", price: 30 },
			{ name: "Oat Milk", price: 40 },
			{ name: "Vanilla Syrup", price: 20 },
			{ name: "Caramel Syrup", price: 20 },
		],
	});

	console.log("✅ POS data seeded.");
}

async function main() {
	await seedAdmin();
	await seedPosData();
	console.log("✅ Seeding complete");
}

main()
	.catch((e) => {
		console.error("❌ Error seeding database:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
