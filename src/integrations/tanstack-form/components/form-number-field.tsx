"use client";

import { Input } from "@/components/ui/input";
import { useFieldContext } from "../index";
import { FormField } from "./form-field";

interface FormNumberFieldProps {
	label: string;
	description?: string;
	placeholder?: string;
	step?: string;
	min?: string;
	max?: string;
}

function FormNumberField({
	label,
	description,
	...props
}: FormNumberFieldProps) {
	const field = useFieldContext<number>();
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

	return (
		<FormField label={label} description={description}>
			<Input
				id={field.name}
				type="number"
				value={field.state.value}
				onChange={(e) => {
							const val = e.target.valueAsNumber;
							field.handleChange(Number.isNaN(val) ? 0 : val);
						}}
				onBlur={field.handleBlur}
				aria-invalid={isInvalid}
				{...props}
			/>
		</FormField>
	);
}

export type { FormNumberFieldProps };
export { FormNumberField };
