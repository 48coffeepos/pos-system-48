import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../../generated/prisma/client.js";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
	const adapter = new PrismaNeon({
		connectionString: process.env.DATABASE_URL!,
	});
	return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;

	if (import.meta.hot) {
		import.meta.hot.dispose(() => {
			void globalForPrisma.prisma?.$disconnect();
			delete globalForPrisma.prisma;
		});
	}
}
