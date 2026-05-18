import { createServerFn } from "@tanstack/react-start";
import { auth } from "@/integrations/better-auth/auth";

export const getUser = createServerFn().handler(async () => {
	return await auth.api.getUser();
});
