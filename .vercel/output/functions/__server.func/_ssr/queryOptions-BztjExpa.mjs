import { r as createServerFn } from "./ssr.mjs";
import { t as adminAuthMiddleware } from "./middlewares-D1Pk677b.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CPlEDLjn.mjs";
import { r as queryOptions } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/queryOptions-BztjExpa.js
var adminUsersKeys = {
	all: ["admin", "users"],
	accounts: () => [...adminUsersKeys.all, "accounts"],
	account: (userId) => [...adminUsersKeys.accounts(), userId]
};
var getAccounts = createServerFn().middleware([adminAuthMiddleware()]).handler(createSsrRpc("7cf04691949f6c4c8547cfe6a7abb545bab585ef8b64378638e599752e410423"));
var adminAccountsQueryOptions = queryOptions({
	queryKey: adminUsersKeys.accounts(),
	queryFn: getAccounts
});
//#endregion
export { adminUsersKeys as n, adminAccountsQueryOptions as t };
