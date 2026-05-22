import { toast } from "sonner";
import { useAppForm } from "@/integrations/tanstack-form";
import { formatPeso } from "@/lib/format-currency";
import { PosFormSchema, type PosFormValues } from "../schemas/posFormSchema";
import { usePosStore } from "../stores/usePosStore";

export function usePosForm() {
	const defaultValues: PosFormValues = {
		note: "",
		paymentMethod: "CASH" as const,
		amountPaid: "",
		referenceNumber: "",
	};
	const form = useAppForm({
		defaultValues,
		validators: {
			onChange: PosFormSchema,
		},
		onSubmit: async ({ value }) => {
			const state = usePosStore.getState();
			const cart = state.cart;
			const cartTotal = cart.reduce((s, c) => s + c.total_price, 0);

			if (cart.length === 0) {
				toast.error("Cart is empty");
				return;
			}
			const paidNum = parseFloat(value.amountPaid) || 0;
			if (value.paymentMethod !== "GRAB" && paidNum < cartTotal) {
				toast.error(`Insufficient amount. Total is ${formatPeso(cartTotal)}`);
				return;
			}
			if (
				(value.paymentMethod === "GCASH" || value.paymentMethod === "GRAB") &&
				!value.referenceNumber.trim()
			) {
				toast.error("Please enter reference number");
				return;
			}
			state.setShowPlaceOrderConfirm(true);
		},
	});

	return form;
}
