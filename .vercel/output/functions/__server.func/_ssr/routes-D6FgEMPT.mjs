import { I as require_jsx_runtime } from "../_libs/@base-ui/react+[...].mjs";
import { p as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { n as SignInSchema, r as signInFormSchema } from "./auth-sfwZ8EMW.mjs";
import { _ as useAppForm } from "./tanstack-form-BSMHRPNr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CPlEDLjn.mjs";
import { t as authKeys } from "./keys-BvhxOWQj.mjs";
import { n as useMutation, t as mutationOptions } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as getAuthRedirectPath } from "./redirectPath-ByWaWr2Z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D6FgEMPT.js
var import_jsx_runtime = require_jsx_runtime();
var signIn = createServerFn({ method: "POST" }).inputValidator(SignInSchema).handler(createSsrRpc("5ba634fa18e37298b803642ebd1a5944d1405fd4cc8f868f611e6b5106e578ce"));
createServerFn().handler(createSsrRpc("dd78c664f8d5cf1334d03ac0b2f5d3cf9e666493fab639054431c28528ada198"));
var signInMutationOptions = () => {
	const router = useRouter();
	return mutationOptions({
		mutationFn: async (input) => {
			return await signIn({ data: input });
		},
		onSuccess: (user, __, ___, context) => {
			toast.success(`Signed in successfully: ${user.username} ${"role" in user && `(${user.role})`}`);
			context.client.invalidateQueries({ queryKey: authKeys.all });
			router.navigate({ to: getAuthRedirectPath(user.role) });
		},
		onError: (error) => {
			toast.error(error.message);
		}
	});
};
var useSignIn = () => {
	const mutation = useMutation(signInMutationOptions());
	return useAppForm({
		defaultValues: {
			identifier: "",
			password: ""
		},
		validators: { onSubmit: signInFormSchema },
		onSubmit: async ({ value }) => {
			const input = value.identifier.includes("@") ? {
				method: "email",
				email: value.identifier,
				password: value.password
			} : {
				method: "username",
				username: value.identifier,
				password: value.password
			};
			await mutation.mutateAsync(input);
		}
	});
};
function SignInForm() {
	const form = useSignIn();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: (e) => {
			e.preventDefault();
			form.handleSubmit();
		},
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
				name: "identifier",
				children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.Input, {
					label: "Email or Username",
					placeholder: "Email or Username"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
				name: "password",
				children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.Password, {
					label: "Password",
					placeholder: "Enter password"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppForm, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.SubmitButton, { label: "Log In" }) })
		]
	}) });
}
function SignInPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "flex min-h-screen items-center justify-center p-4 bg-[#F2EAE1]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-105 bg-white rounded-4xl p-8 md:p-10 shadow-sm relative",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col items-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/logo.png",
						alt: "48 Coffee",
						className: "mb-3 h-30 w-auto"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center mb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-bold text-[#422D27] mb-2",
						children: "Login"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[#8B7C7A]",
						children: "Please Login to continue"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInForm, {})
			]
		})
	});
}
var SplitComponent = SignInPage;
//#endregion
export { SplitComponent as component };
