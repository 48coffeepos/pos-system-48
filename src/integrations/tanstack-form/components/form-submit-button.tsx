"use client";

import { Button } from "@/components/ui/button";
import { useFormContext } from "../index";

interface FormSubmitButtonProps {
	label?: string;
	className?: string;
}

function FormSubmitButton({
	label = "Submit",
	className,
}: FormSubmitButtonProps) {
	const form = useFormContext();

	return (
		<form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
			{([canSubmit, isSubmitting]) => (
				<Button type="submit" disabled={!canSubmit} className={className}>
					{isSubmitting ? `${label}...` : label}
				</Button>
			)}
		</form.Subscribe>
	);
}

export type { FormSubmitButtonProps };
export { FormSubmitButton };
