"use client";

import { Input } from "@/components/ui/input";
import { useFieldContext } from "../index";
import { FormField } from "./form-field";
import { useState, useEffect } from "react";

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
	const [raw, setRaw] = useState(() => String(field.state.value));

	useEffect(() => {
		setRaw(String(field.state.value));
	}, [field.state.value]);

	return (
		<FormField label={label} description={description}>
			<Input
				id={field.name}
				type="number"
				value={raw}
				onChange={(e) => {
					const next = e.target.value;
					setRaw(next);
					if (next === "") return;
					const val = parseFloat(next);
					if (!Number.isNaN(val)) {
						field.handleChange(val);
					}
				}}
				onBlur={(e) => {
					field.handleBlur();
					if (e.target.value === "" || Number.isNaN(parseFloat(e.target.value))) {
						setRaw(String(field.state.value));
					}
				}}
				aria-invalid={isInvalid}
				{...props}
			/>
		</FormField>
	);
}

export type { FormNumberFieldProps };
export { FormNumberField };
