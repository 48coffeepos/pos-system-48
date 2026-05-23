//#region node_modules/.nitro/vite/services/ssr/assets/format-currency-OpqMVH6X.js
function formatPeso(amount) {
	return new Intl.NumberFormat("en-PH", {
		style: "currency",
		currency: "PHP",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(amount);
}
//#endregion
export { formatPeso as t };
