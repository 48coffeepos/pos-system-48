import { MagnifyingGlass } from "@phosphor-icons/react";
import { useFieldContext } from "@/integrations/tanstack-form";

export function PosMenuSearchField() {
	const field = useFieldContext<string>();

	return (
		<div className="relative mb-4">
			<MagnifyingGlass
				className="absolute top-1/2 left-4 size-5 -translate-y-1/2"
				style={{ color: "var(--medium-gray)" }}
			/>
			<input
				id={field.name}
				type="text"
				value={field.state.value}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.target.value)}
				placeholder="Search menu items..."
				aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
				className="h-12 w-full rounded-xl border pl-12 pr-4 text-sm outline-none transition-all"
				style={{ background: "white", borderColor: "var(--light-gray)" }}
			/>
		</div>
	);
}
