import { createFileRoute } from "@tanstack/react-router";
import { prisma } from "@/integrations/prisma/db";

function getCronToken(request: Request) {
	const authHeader = request.headers.get("authorization");
	const headerToken = authHeader?.replace(/^bearer\s+/i, "");
	if (headerToken) return headerToken;

	const url = new URL(request.url);
	return url.searchParams.get("token");
}

export const Route = createFileRoute("/api/cron/update-yesterday-stock")({
	server: {
		handlers: {
			GET: async ({ request }: { request: Request }) => {
				const expectedToken = process.env.CRON_SECRET;
				const receivedToken = getCronToken(request);

				if (expectedToken && receivedToken !== expectedToken) {
					return new Response("Unauthorized", { status: 401 });
				}

				await prisma.$executeRaw`select roll_inventory_daily_ledger();`;
				return new Response("OK", { status: 200 });
			},
		},
	},
});
