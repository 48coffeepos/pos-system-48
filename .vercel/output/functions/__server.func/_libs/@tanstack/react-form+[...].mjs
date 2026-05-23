import { o as __toESM } from "../../_runtime.mjs";
import { F as require_with_selector, I as require_jsx_runtime, L as require_react } from "../@base-ui/react+[...].mjs";
import { i as FormApi, n as FieldGroupApi, o as functionalUpdate, r as FieldApi, s as uuid, t as mergeAndUpdate } from "./form-core+[...].mjs";
//#region node_modules/@tanstack/react-store/dist/esm/useStore.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_with_selector = require_with_selector();
function defaultCompare(a, b) {
	return a === b;
}
function useStore(atom, selector, compare = defaultCompare) {
	const subscribe = (0, import_react.useCallback)((handleStoreChange) => {
		if (!atom) return () => {};
		const { unsubscribe } = atom.subscribe(handleStoreChange);
		return unsubscribe;
	}, [atom]);
	const boundGetSnapshot = (0, import_react.useCallback)(() => atom?.get(), [atom]);
	return (0, import_with_selector.useSyncExternalStoreWithSelector)(subscribe, boundGetSnapshot, boundGetSnapshot, selector, compare);
}
//#endregion
//#region node_modules/@tanstack/react-form/dist/esm/useIsomorphicLayoutEffect.js
var import_jsx_runtime = require_jsx_runtime();
var useIsomorphicLayoutEffect = typeof window !== "undefined" ? import_react.useLayoutEffect : import_react.useEffect;
//#endregion
//#region node_modules/@tanstack/react-form/dist/esm/useField.js
function useField(opts) {
	const [prevOptions, setPrevOptions] = (0, import_react.useState)(() => ({
		form: opts.form,
		name: opts.name
	}));
	const [fieldApi, setFieldApi] = (0, import_react.useState)(() => {
		return new FieldApi({ ...opts });
	});
	if (prevOptions.form !== opts.form || prevOptions.name !== opts.name) {
		setFieldApi(new FieldApi({ ...opts }));
		setPrevOptions({
			form: opts.form,
			name: opts.name
		});
	}
	const reactiveStateValue = useStore(fieldApi.store, opts.mode === "array" ? (state) => state.meta._arrayVersion || 0 : (state) => state.value);
	const reactiveMetaIsTouched = useStore(fieldApi.store, (state) => state.meta.isTouched);
	const reactiveMetaIsBlurred = useStore(fieldApi.store, (state) => state.meta.isBlurred);
	const reactiveMetaIsDirty = useStore(fieldApi.store, (state) => state.meta.isDirty);
	const reactiveMetaErrorMap = useStore(fieldApi.store, (state) => state.meta.errorMap);
	const reactiveMetaErrorSourceMap = useStore(fieldApi.store, (state) => state.meta.errorSourceMap);
	const reactiveMetaIsValidating = useStore(fieldApi.store, (state) => state.meta.isValidating);
	const extendedFieldApi = (0, import_react.useMemo)(() => {
		return {
			...fieldApi,
			get state() {
				return {
					value: opts.mode === "array" ? fieldApi.state.value : reactiveStateValue,
					get meta() {
						return {
							...fieldApi.state.meta,
							isTouched: reactiveMetaIsTouched,
							isBlurred: reactiveMetaIsBlurred,
							isDirty: reactiveMetaIsDirty,
							errorMap: reactiveMetaErrorMap,
							errorSourceMap: reactiveMetaErrorSourceMap,
							isValidating: reactiveMetaIsValidating
						};
					}
				};
			}
		};
	}, [
		fieldApi,
		opts.mode,
		reactiveStateValue,
		reactiveMetaIsTouched,
		reactiveMetaIsBlurred,
		reactiveMetaIsDirty,
		reactiveMetaErrorMap,
		reactiveMetaErrorSourceMap,
		reactiveMetaIsValidating
	]);
	useIsomorphicLayoutEffect(fieldApi.mount, [fieldApi]);
	useIsomorphicLayoutEffect(() => {
		fieldApi.update(opts);
	});
	return extendedFieldApi;
}
var Field = (({ children, ...fieldOptions }) => {
	const fieldApi = useField(fieldOptions);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: (0, import_react.useMemo)(() => functionalUpdate(children, fieldApi), [children, fieldApi]) });
});
//#endregion
//#region node_modules/@tanstack/react-form/dist/esm/useUUID.js
function useUUID() {
	return (0, import_react.useState)(() => uuid())[0];
}
//#endregion
//#region node_modules/@tanstack/react-form/dist/esm/useFormId.js
var _React = import_react;
var useFormId = "19.2.6".split(".")[0] === "17" ? useUUID : _React.useId;
//#endregion
//#region node_modules/@tanstack/react-form/dist/esm/useForm.js
function LocalSubscribe$1({ form, selector = (state) => state, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: functionalUpdate(children, useStore(form.store, selector)) });
}
function useForm(opts) {
	const fallbackFormId = useFormId();
	const [prevFormId, setPrevFormId] = (0, import_react.useState)(opts?.formId);
	const [formApi, setFormApi] = (0, import_react.useState)(() => {
		return new FormApi({
			...opts,
			formId: opts?.formId ?? fallbackFormId
		});
	});
	if (prevFormId !== opts?.formId) {
		const formId = opts?.formId ?? fallbackFormId;
		setFormApi(new FormApi({
			...opts,
			formId
		}));
		setPrevFormId(formId);
	}
	const extendedFormApi = (0, import_react.useMemo)(() => {
		const extendedApi = {
			...formApi,
			handleSubmit: ((...props) => {
				return formApi._handleSubmit(...props);
			}),
			get formId() {
				return formApi._formId;
			},
			get state() {
				return formApi.store.state;
			}
		};
		extendedApi.Field = function APIField(props) {
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				...props,
				form: formApi
			});
		};
		extendedApi.Subscribe = function Subscribe(props) {
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocalSubscribe$1, {
				form: formApi,
				selector: props.selector,
				children: props.children
			});
		};
		return extendedApi;
	}, [formApi]);
	useIsomorphicLayoutEffect(formApi.mount, []);
	useIsomorphicLayoutEffect(() => {
		formApi.update(opts);
	});
	const hasRan = (0, import_react.useRef)(false);
	useIsomorphicLayoutEffect(() => {
		if (!hasRan.current) return;
		if (!opts?.transform) return;
		mergeAndUpdate(formApi, opts.transform);
	}, [formApi, opts?.transform]);
	useIsomorphicLayoutEffect(() => {
		hasRan.current = true;
	});
	return extendedFormApi;
}
//#endregion
//#region node_modules/@tanstack/react-form/dist/esm/useFieldGroup.js
function LocalSubscribe({ lens, selector = (state) => state, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: functionalUpdate(children, useStore(lens.store, selector)) });
}
function useFieldGroup(opts) {
	const [formLensApi] = (0, import_react.useState)(() => {
		const api = new FieldGroupApi(opts);
		const form = opts.form instanceof FieldGroupApi ? opts.form.form : opts.form;
		const extendedApi = api;
		extendedApi.AppForm = function AppForm(appFormProps) {
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppForm, { ...appFormProps });
		};
		extendedApi.AppField = function AppField(props) {
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, { ...formLensApi.getFormFieldOptions(props) });
		};
		extendedApi.Field = function Field(props) {
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, { ...formLensApi.getFormFieldOptions(props) });
		};
		extendedApi.Subscribe = function Subscribe(props) {
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocalSubscribe, {
				lens: formLensApi,
				selector: props.selector,
				children: props.children
			});
		};
		return Object.assign(extendedApi, { ...opts.formComponents });
	});
	useIsomorphicLayoutEffect(formLensApi.mount, [formLensApi]);
	return formLensApi;
}
//#endregion
//#region node_modules/@tanstack/react-form/dist/esm/createFormHook.js
var fieldContext = (0, import_react.createContext)(null);
var formContext = (0, import_react.createContext)(null);
function useFormContext() {
	const form = (0, import_react.useContext)(formContext);
	if (!form) throw new Error("`formContext` only works when within a `formComponent` passed to `createFormHook`");
	return form;
}
function createFormHookContexts() {
	function useFieldContext() {
		const field = (0, import_react.useContext)(fieldContext);
		if (!field) throw new Error("`fieldContext` only works when within a `fieldComponent` passed to `createFormHook`");
		return field;
	}
	return {
		fieldContext,
		useFieldContext,
		useFormContext,
		formContext
	};
}
function createFormHook({ fieldComponents, fieldContext: fieldContext2, formContext: formContext2, formComponents }) {
	function useAppForm(props) {
		const form = useForm(props);
		const AppForm = (0, import_react.useMemo)(() => {
			return ({ children }) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(formContext2.Provider, {
					value: form,
					children
				});
			};
		}, [form]);
		const AppField = (0, import_react.useMemo)(() => {
			const AppField2 = (({ children, ...props2 }) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
					...props2,
					children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(fieldContext2.Provider, {
						value: field,
						children: children(Object.assign(field, fieldComponents))
					})
				});
			});
			return AppField2;
		}, [form]);
		return (0, import_react.useMemo)(() => {
			return Object.assign(form, {
				AppField,
				AppForm,
				...formComponents
			});
		}, [
			form,
			AppField,
			AppForm
		]);
	}
	function withForm({ render, props }) {
		return function Render(innerProps) {
			return render({
				...props,
				...innerProps
			});
		};
	}
	function withFieldGroup({ render, props, defaultValues }) {
		return function Render(innerProps) {
			const fieldGroupApi = useFieldGroup((0, import_react.useMemo)(() => {
				return {
					form: innerProps.form,
					fields: innerProps.fields,
					defaultValues,
					formComponents
				};
			}, [innerProps.form, innerProps.fields]));
			return render({
				...props,
				...innerProps,
				group: fieldGroupApi
			});
		};
	}
	function useTypedAppFormContext(_props) {
		return useFormContext();
	}
	function extendForm(extension) {
		return createFormHook({
			fieldContext: fieldContext2,
			formContext: formContext2,
			fieldComponents: {
				...fieldComponents,
				...extension.fieldComponents
			},
			formComponents: {
				...formComponents,
				...extension.formComponents
			}
		});
	}
	return {
		useAppForm,
		withForm,
		withFieldGroup,
		useTypedAppFormContext,
		extendForm
	};
}
//#endregion
export { createFormHookContexts as n, useStore as r, createFormHook as t };
