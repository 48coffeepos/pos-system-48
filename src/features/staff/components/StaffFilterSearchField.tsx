import { MagnifyingGlass } from "@phosphor-icons/react";
import { useFieldContext } from "@/integrations/tanstack-form";

interface StaffFilterSearchFieldProps {
	placeholder?: string;
}

export function StaffFilterSearchField({
	placeholder = "Search...",
}: StaffFilterSearchFieldProps) {
	const field = useFieldContext<string>();

	return (
		<div className="relative w-full max-w-xs">
			<MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-(--medium-gray)" />
			<input
				id={field.name}
				type="search"
				value={field.state.value}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.target.value)}
				placeholder={placeholder}
				aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
				className="h-9 w-full rounded-xl border border-(--light-gray) bg-white pl-9 pr-3 text-sm outline-none focus:border-(--forest-green) focus:ring-1 focus:ring-(--forest-green)"
			/>
		</div>
	);
}
