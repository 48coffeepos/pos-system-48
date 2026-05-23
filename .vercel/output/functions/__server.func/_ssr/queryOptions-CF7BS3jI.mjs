import { r as createServerFn } from "./ssr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CPlEDLjn.mjs";
import { t as authKeys } from "./keys-BvhxOWQj.mjs";
import { r as queryOptions } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/queryOptions-CF7BS3jI.js
var getSession = createServerFn().handler(createSsrRpc("1ae01ff38f50c67da481ebc1fd064cbb754fb1e198e4a11c16129b79b234e87e"));
var sessionQueryOptions = queryOptions({
	queryKey: authKeys.session(),
	queryFn: getSession
});
//#endregion
export { sessionQueryOptions as t };
