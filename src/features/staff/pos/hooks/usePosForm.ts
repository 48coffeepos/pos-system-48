import { useEffect } from "react";
import { toast } from "sonner";
import { useAppForm } from "@/integrations/tanstack-form";
import { formatPeso } from "@/lib/format-currency";
import { PosFormSchema } from "../schemas/posFormSchema";
import { usePosStore } from "../stores/usePosStore";

export function usePosForm() {
	const formValues = usePosStore((state) => state.formValues);
	const setFormValues = usePosStore((state) => state.setFormValues);

	const form = useAppForm({
		defaultValues: formValues,
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

	useEffect(() => {
		const subscription = form.store.subscribe(() => {
			setFormValues(form.state.values);
		});
		return () => subscription.unsubscribe();
	}, [form, setFormValues]);

	useEffect(() => {
		const syncFormFromStore = () => {
			form.reset(usePosStore.getState().formValues);
		};

		if (usePosStore.persist.hasHydrated()) {
			syncFormFromStore();
		}

		return usePosStore.persist.onFinishHydration(syncFormFromStore);
	}, [form]);

	return form;
}
