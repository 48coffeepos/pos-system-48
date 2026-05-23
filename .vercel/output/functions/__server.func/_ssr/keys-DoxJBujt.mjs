//#region node_modules/.nitro/vite/services/ssr/assets/keys-DoxJBujt.js
var xreadingKeys = {
	all: ["xreading"],
	daily: (timeframe) => [
		...xreadingKeys.all,
		"daily",
		timeframe
	]
};
//#endregion
export { xreadingKeys as t };
