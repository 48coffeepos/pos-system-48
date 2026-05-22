"use client";

import { Input } from "@/components/ui/input";
import { useFieldContext } from "../index";
import { FormField } from "./form-field";

interface FormInputProps {
	label: string;
	description?: string;
	placeholder?: string;
	type?: string;
}

function FormInput({ label, description, ...props }: FormInputProps) {
	const field = useFieldContext<string>();
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

	return (
		<FormField label={label} description={description}>
			<Input
				id={field.name}
				value={field.state.value}
				onChange={(e) => field.handleChange(e.target.value)}
				onBlur={field.handleBlur}
				aria-invalid={isInvalid}
				{...props}
			/>
		</FormField>
	);
}

export type { FormInputProps };
export { FormInput };
