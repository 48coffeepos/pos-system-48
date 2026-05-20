import { createMiddleware } from "@tanstack/react-start";
import { auth } from "@/integrations/better-auth/auth";

// ---- Server function middleware (for createServerFn) ----

export const authMiddleware = createMiddleware().server(
	async ({ next, request }) => {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session?.user) {
			throw new Error("Unauthorized");
		}
		return next({ context: { session } });
	},
);

export function adminAuthMiddleware() {
	return createMiddleware({ type: "function" })
		.middleware([authMiddleware])
		.server(async ({ next, context }) => {
			if (context.session.user?.role !== "admin") {
				throw new Error("Forbidden");
			}
			return next();
		});
}
