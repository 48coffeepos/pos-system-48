import type { RefObject } from "react";
import { Input } from "@/components/ui/input";
import { useFieldContext } from "@/integrations/tanstack-form";

interface StaffHeaderSearchFieldProps {
	placeholder: string;
	className?: string;
	inputRef?: RefObject<HTMLInputElement | null>;
	onFocus?: () => void;
}

export function StaffHeaderSearchField({
	placeholder,
	className,
	inputRef,
	onFocus,
}: StaffHeaderSearchFieldProps) {
	const field = useFieldContext<string>();

	return (
		<Input
			ref={inputRef}
			id={field.name}
			value={field.state.value}
			onBlur={field.handleBlur}
			onFocus={onFocus}
			onChange={(e) => field.handleChange(e.target.value)}
			placeholder={placeholder}
			aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
			className={className}
		/>
	);
}
