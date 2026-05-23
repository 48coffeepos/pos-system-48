import { I as require_jsx_runtime } from "../_libs/@base-ui/react+[...].mjs";
import { n as cn, t as Button$1 } from "./button-B7PjkOIj.mjs";
import { n as e } from "../_libs/phosphor-icons__react.mjs";
import { i as AlertDialogContent, t as AlertDialog$1 } from "./alert-dialog-BOYnFZY-.mjs";
import { u as posBtnGhost } from "./pos-ui-Czx3k4Q7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PosModal-AjEJrogY.js
var import_jsx_runtime = require_jsx_runtime();
function PosModal({ open, onClose, children, className, showClose = false, overlayClassName }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog$1, {
		open,
		onOpenChange: (isOpen) => {
			if (!isOpen) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, {
			className: cn("border-(--light-gray) bg-(--pure-white)", overlayClassName, className),
			children: [showClose ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
				variant: "ghost",
				size: "icon",
				onClick: onClose,
				className: cn("absolute top-4 right-4 rounded-full", posBtnGhost),
				"aria-label": "Close",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(e, { className: "size-5" })
			}) : null, children]
		})
	});
}
//#endregion
export { PosModal as t };
