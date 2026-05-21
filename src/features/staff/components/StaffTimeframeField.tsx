import { useFieldContext } from "@/integrations/tanstack-form";

const options = [
	{ value: "today" as const, label: "Today" },
	{ value: "yesterday" as const, label: "Yesterday" },
];

export function StaffTimeframeField() {
	const field = useFieldContext<"today" | "yesterday">();

	return (
		<div className="flex shrink-0 gap-1.5 rounded-full bg-(--light-gray)/30 p-1">
			{options.map((opt) => (
				<button
					key={opt.value}
					type="button"
					onClick={() => field.handleChange(opt.value)}
					className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
						field.state.value === opt.value
							? "bg-(--deep-forest) text-white shadow-sm"
							: "text-(--medium-gray) hover:bg-(--light-gray)/50"
					}`}
				>
					{opt.label}
				</button>
			))}
		</div>
	);
}
