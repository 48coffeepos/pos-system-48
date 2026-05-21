import { adminClient, usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { adminPluginConfig } from "@/features/auth/access";

export const authClient = createAuthClient({
	plugins: [adminClient(adminPluginConfig), usernameClient()],
});
