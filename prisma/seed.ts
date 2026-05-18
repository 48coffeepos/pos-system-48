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

async function main() {
	const email = process.env.EMAIL;
	const password = process.env.PASS;

	if (!email || !password) {
		console.error("❌ EMAIL and PASS environment variables are required");
		process.exit(1);
	}

	console.log("🌱 Seeding database...");

	await prisma.todo.deleteMany();
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

	const todos = await prisma.todo.createMany({
		data: [
			{ title: "Buy groceries" },
			{ title: "Read a book" },
			{ title: "Workout" },
		],
	});

	console.log(`✅ Created ${todos.count} todos`);
}

main()
	.catch((e) => {
		console.error("❌ Error seeding database:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
