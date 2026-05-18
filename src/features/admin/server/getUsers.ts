import { createServerFn } from "@tanstack/react-start";
import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";

const getUsers = createServerFn()
	.middleware([adminAuthMiddleware()])
	.handler(async () => {
		const users = await prisma.user.findMany();
		return users;
	});

export default getUsers;
