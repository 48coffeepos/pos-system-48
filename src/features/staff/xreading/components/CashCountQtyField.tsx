import { useFieldContext } from "@/integrations/tanstack-form";

export function CashCountQtyField() {
	const field = useFieldContext<number>();
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

	return (
		<input
			id={field.name}
			type="number"
			min={0}
			aria-invalid={isInvalid}
			value={field.state.value === 0 ? "" : field.state.value}
			onBlur={field.handleBlur}
			onChange={(e) => {
				if (e.target.value === "") {
					field.handleChange(0);
					return;
				}
				const val = Number.parseInt(e.target.value, 10);
				field.handleChange(Number.isNaN(val) || val < 0 ? 0 : val);
			}}
			className="w-20 rounded-lg border border-(--light-gray) bg-white px-3 py-1.5 text-center font-medium focus:border-(--forest-green) focus:outline-none focus:ring-1 focus:ring-(--forest-green)"
		/>
	);
}
