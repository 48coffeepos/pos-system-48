import { createServerFn } from "@tanstack/react-start";
import { adminAuthMiddleware } from "@/features/auth/middlewares";
import type { AdminAccount } from "@/features/admin/accounts/types";
import { prisma } from "@/integrations/prisma/db";

const getAccounts = createServerFn()
	.middleware([adminAuthMiddleware()])
	.handler(async (): Promise<AdminAccount[]> => {
		const now = new Date();

		const [users, sessions] = await Promise.all([
			prisma.user.findMany({
				select: {
					id: true,
					name: true,
					email: true,
					username: true,
					role: true,
					banned: true,
					updatedAt: true,
				},
				orderBy: [{ role: "asc" }, { name: "asc" }],
			}),
			prisma.session.findMany({
				select: {
					userId: true,
					updatedAt: true,
					expiresAt: true,
				},
				orderBy: { updatedAt: "desc" },
			}),
		]);

		const latestSessionByUserId = new Map<string, Date>();
		const onlineUserIds = new Set<string>();

		for (const session of sessions) {
			if (!latestSessionByUserId.has(session.userId)) {
				latestSessionByUserId.set(session.userId, session.updatedAt);
			}

			if (session.expiresAt > now) {
				onlineUserIds.add(session.userId);
			}
		}

		return users.map((user) => ({
			id: user.id,
			name: user.name,
			email: user.email,
			username: user.username,
			role: user.role,
			banned: Boolean(user.banned),
			isOnline: onlineUserIds.has(user.id),
			lastSeenAt: latestSessionByUserId.get(user.id) ?? null,
			updatedAt: user.updatedAt,
		}));
	});

export default getAccounts;
