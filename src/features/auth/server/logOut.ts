import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@/integrations/better-auth/auth";

const signOut = createServerFn().handler(async () => {
	const headers = getRequestHeaders();
	await auth.api.signOut({ headers });
});

export default signOut;
