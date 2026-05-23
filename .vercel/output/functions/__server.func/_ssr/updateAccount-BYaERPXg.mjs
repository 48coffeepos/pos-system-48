import { c as auth } from "./auth-BTxLf562.mjs";
import { i as getRequestHeaders, r as createServerFn } from "./ssr.mjs";
import { t as adminAuthMiddleware } from "./middlewares-D1Pk677b.mjs";
import { r as UpdateAccountSchema } from "./admin-B2cGA_2Z.mjs";
import { t as createServerRpc } from "./createServerRpc-Cc--TFGz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/updateAccount-BYaERPXg.js
var updateAccount_createServerFn_handler = createServerRpc({
	id: "69cb9e663962c2faadf2dd6f0f1542031e2d1194fb0d83f2fe6e4da8b7fd3a5b",
	name: "updateAccount",
	filename: "src/features/admin/accounts/server/updateAccount.ts"
}, (opts) => updateAccount.__executeServer(opts));
var updateAccount = createServerFn({ method: "POST" }).middleware([adminAuthMiddleware()]).inputValidator(UpdateAccountSchema).handler(updateAccount_createServerFn_handler, async ({ data }) => {
	const headers = getRequestHeaders();
	const updatedUser = await auth.api.adminUpdateUser({
		body: {
			userId: data.userId,
			data: { name: data.name }
		},
		headers
	});
	if (data.password) await auth.api.setUserPassword({
		body: {
			userId: data.userId,
			newPassword: data.password
		},
		headers
	});
	return updatedUser;
});
//#endregion
export { updateAccount_createServerFn_handler };
