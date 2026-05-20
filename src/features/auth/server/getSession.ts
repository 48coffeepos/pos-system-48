import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import { auth } from "@/integrations/better-auth/auth";

export const getSession = createServerFn().handler(async () => {
	const headers = getRequestHeaders();
	return await auth.api.getSession({ headers });
});
