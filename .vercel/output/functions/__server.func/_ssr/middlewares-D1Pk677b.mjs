import { c as auth } from "./auth-BTxLf562.mjs";
import { n as createMiddleware } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/middlewares-D1Pk677b.js
var authMiddleware = createMiddleware().server(async ({ next, request }) => {
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session?.user) throw new Error("Unauthorized");
	return next({ context: { session } });
});
function adminAuthMiddleware() {
	return createMiddleware({ type: "function" }).middleware([authMiddleware]).server(async ({ next, context }) => {
		if (context.session.user?.role !== "admin") throw new Error("Forbidden");
		return next();
	});
}
//#endregion
export { authMiddleware as n, adminAuthMiddleware as t };
