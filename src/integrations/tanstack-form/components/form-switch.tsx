"use client";

import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { useFieldContext } from "../index";

interface FormSwitchProps {
	label: string;
	description?: string;
}

function FormSwitch({ label, description }: FormSwitchProps) {
	const field = useFieldContext<boolean>();
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

	return (
		<Field orientation="horizontal" data-invalid={isInvalid}>
			<FieldContent>
				<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
				{description && <FieldDescription>{description}</FieldDescription>}
			</FieldContent>
			<Switch
				id={field.name}
				checked={field.state.value}
				onCheckedChange={field.handleChange}
				aria-invalid={isInvalid}
			/>
			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	);
}

export type { FormSwitchProps };
export { FormSwitch };
