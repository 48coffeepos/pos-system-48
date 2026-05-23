import { m as prisma } from "./auth-BTxLf562.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as adminAuthMiddleware } from "./middlewares-D1Pk677b.mjs";
import { t as createServerRpc } from "./createServerRpc-Cc--TFGz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/getAccounts-taxYo-Dv.js
var getAccounts_createServerFn_handler = createServerRpc({
	id: "7cf04691949f6c4c8547cfe6a7abb545bab585ef8b64378638e599752e410423",
	name: "getAccounts",
	filename: "src/features/admin/accounts/server/getAccounts.ts"
}, (opts) => getAccounts.__executeServer(opts));
var getAccounts = createServerFn().middleware([adminAuthMiddleware()]).handler(getAccounts_createServerFn_handler, async () => {
	const now = /* @__PURE__ */ new Date();
	const [users, sessions] = await Promise.all([prisma.user.findMany({
		select: {
			id: true,
			name: true,
			email: true,
			username: true,
			role: true,
			banned: true,
			updatedAt: true
		},
		orderBy: [{ role: "asc" }, { name: "asc" }]
	}), prisma.session.findMany({
		select: {
			userId: true,
			updatedAt: true,
			expiresAt: true
		},
		orderBy: { updatedAt: "desc" }
	})]);
	const latestSessionByUserId = /* @__PURE__ */ new Map();
	const onlineUserIds = /* @__PURE__ */ new Set();
	for (const session of sessions) {
		if (!latestSessionByUserId.has(session.userId)) latestSessionByUserId.set(session.userId, session.updatedAt);
		if (session.expiresAt > now) onlineUserIds.add(session.userId);
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
		updatedAt: user.updatedAt
	}));
});
//#endregion
export { getAccounts as default, getAccounts_createServerFn_handler };
