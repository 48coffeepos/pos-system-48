//#region node_modules/.nitro/vite/services/ssr/assets/keys-BvhxOWQj.js
var authKeys = {
	all: ["auth"],
	session: () => [...authKeys.all, "session"],
	currentUser: () => [...authKeys.all, "currentUser"]
};
//#endregion
export { authKeys as t };
