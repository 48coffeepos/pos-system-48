import { useEffect } from "react";
import { useStore } from "@tanstack/react-form";
import { useAppForm } from "@/integrations/tanstack-form";
import { authClient } from "@/integrations/better-auth/auth-client";
import { CashCountPanel } from "./CashCountPanel";
import { ReconciliationPanel } from "./ReconciliationPanel";
import { XReadingReceiptDialog } from "./XReadingReceiptDialog";
import {
	cashCountSchema,
	emptyCashCountValues,
	type CashCountValues,
} from "@/features/staff/xreading/schemas/cashCount";
import { useXReadingStore } from "@/features/staff/xreading/stores/useXReadingStore";

interface XReadingScreenProps {
	data: {
		totalCashSales: number;
		totalExpenses: number;
	};
}

export function XReadingScreen({ data }: XReadingScreenProps) {
	const { data: session } = authClient.useSession();
	const staffName = session?.user?.name || "Staff";

	const setReconciliation = useXReadingStore((state) => state.setReconciliation);
	const cashCountResetNonce = useXReadingStore(
		(state) => state.cashCountResetNonce,
	);

	const form = useAppForm({
		defaultValues: emptyCashCountValues(),
		validators: {
			onChange: cashCountSchema,
		},
	});

	useEffect(() => {
		setReconciliation({
			totalCashSales: data.totalCashSales,
			totalExpenses: data.totalExpenses,
		});
	}, [data.totalCashSales, data.totalExpenses, setReconciliation]);

	useEffect(() => {
		if (cashCountResetNonce === 0) return;
		form.reset();
	}, [cashCountResetNonce, form]);

	const formValues = useStore(
		form.store,
		(state) => state.values as CashCountValues,
	);

	const totalCashCounted = Object.entries(formValues).reduce(
		(sum, [denom, qty]) => sum + Number(denom) * qty,
		0,
	);

	return (
		<>
			<div className="grid grid-cols-1 gap-8 print:hidden lg:grid-cols-2">
				<form
					onSubmit={(e) => {
						e.preventDefault();
					}}
				>
					<form.AppForm>
						<CashCountPanel form={form} totalCashCounted={totalCashCounted} />
					</form.AppForm>
				</form>

				<ReconciliationPanel totalCashCounted={totalCashCounted} />
			</div>

			<XReadingReceiptDialog
				staffName={staffName}
				totalCashCounted={totalCashCounted}
				cashCount={formValues}
			/>
		</>
	);
}
