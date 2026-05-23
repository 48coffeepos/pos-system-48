//#region node_modules/.nitro/vite/services/ssr/assets/redirectPath-ByWaWr2Z.js
function getAuthRedirectPath(role) {
	return role === "admin" ? "/admin" : "/staff/pos";
}
//#endregion
export { getAuthRedirectPath as t };
