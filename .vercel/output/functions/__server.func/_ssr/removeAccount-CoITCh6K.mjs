import { c as auth } from "./auth-BTxLf562.mjs";
import { R as object, V as string } from "../_libs/@better-auth/core+[...].mjs";
import { i as getRequestHeaders, r as createServerFn } from "./ssr.mjs";
import { t as adminAuthMiddleware } from "./middlewares-D1Pk677b.mjs";
import { t as createServerRpc } from "./createServerRpc-Cc--TFGz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/removeAccount-CoITCh6K.js
var removeAccount_createServerFn_handler = createServerRpc({
	id: "8acd13e7d2d0979e618e1d53425ddd6f28d3952c765299f2dccfc929ff7f905f",
	name: "removeAccount",
	filename: "src/features/admin/accounts/server/removeAccount.ts"
}, (opts) => removeAccount.__executeServer(opts));
var removeAccount = createServerFn({ method: "POST" }).middleware([adminAuthMiddleware()]).inputValidator(object({ userId: string().min(1, "User ID is required") })).handler(removeAccount_createServerFn_handler, async ({ data }) => {
	const headers = getRequestHeaders();
	return auth.api.removeUser({
		body: { userId: data.userId },
		headers
	});
});
//#endregion
export { removeAccount_createServerFn_handler };
