import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { FormDevtoolsPanel } from "@tanstack/react-form-devtools";
import { FormCheckbox } from "./components/form-checkbox";
import { FormInput } from "./components/form-input";
import { FormRadio } from "./components/form-radio";
import { FormSelect } from "./components/form-select";
import { FormSubmitButton } from "./components/form-submit-button";
import { FormSwitch } from "./components/form-switch";
import { FormTextarea } from "./components/form-textarea";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
	createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
	fieldComponents: {
		Input: FormInput,
		Textarea: FormTextarea,
		Select: FormSelect,
		Checkbox: FormCheckbox,
		Switch: FormSwitch,
		Radio: FormRadio,
	},
	formComponents: {
		SubmitButton: FormSubmitButton,
	},
	fieldContext,
	formContext,
});

export const TanstackFormDevtools = {
	name: "Tanstack Form",
	render: () => <FormDevtoolsPanel />,
};
