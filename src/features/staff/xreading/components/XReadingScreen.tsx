import { useEffect, useState } from "react";
import { useAppForm } from "@/integrations/tanstack-form";
import { CashCountPanel } from "./CashCountPanel";
import { ReconciliationPanel } from "./ReconciliationPanel";
import { XReadingReceiptDialog } from "./XReadingReceiptDialog";
import { authClient } from "@/integrations/better-auth/auth-client";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
	emptyCashCountValues,
	useXReadingStore,
} from "../stores/useXReadingStore";

interface XReadingScreenProps {
	data: {
		totalCashSales: number;
		totalCashOut: number;
		totalCashIn: number;
	};
}

export function XReadingScreen({ data }: XReadingScreenProps) {
	const { data: session } = authClient.useSession();
	const staffName = session?.user?.name || "Staff";

	const cashCount = useXReadingStore((state) => state.cashCount);
	const resetCashCount = useXReadingStore((state) => state.resetCashCount);

	const [showResetModal, setShowResetModal] = useState(false);
	const [receiptMode, setReceiptMode] = useState<"sales" | "cashcount" | null>(
		null,
	);

	const form = useAppForm({
		defaultValues: cashCount,
	});

	useEffect(() => {
		const syncFormFromStore = () => {
			form.reset(useXReadingStore.getState().cashCount);
		};

		syncFormFromStore();

		return useXReadingStore.persist.onFinishHydration(syncFormFromStore);
	}, [form]);

	const totalCashCounted = Object.entries(cashCount).reduce(
		(sum, [denom, qty]) => sum + Number(denom) * qty,
		0,
	);

	const handleExportSales = () => {
		setReceiptMode("sales");
	};

	const handleExportCashCount = () => {
		setReceiptMode("cashcount");
	};

	return (
		<>
			{/* On-screen UI */}
			<div className="grid grid-cols-1 gap-4 print:hidden lg:grid-cols-2">
				<form.AppForm>
					<CashCountPanel
						form={form}
						totalCashCounted={totalCashCounted}
						onResetClick={() => setShowResetModal(true)}
					/>
				</form.AppForm>

				<ReconciliationPanel
					totals={{
						totalCashSales: data.totalCashSales,
						totalCashOut: data.totalCashOut,
						totalCashIn: data.totalCashIn,
					}}
					totalCashCounted={totalCashCounted}
					onExportSales={handleExportSales}
					onExportCashCount={handleExportCashCount}
				/>
			</div>

			<AlertDialog open={showResetModal} onOpenChange={setShowResetModal}>
				<AlertDialogContent size="sm">
					<AlertDialogHeader>
						<AlertDialogTitle>Reset Cash Count?</AlertDialogTitle>
						<AlertDialogDescription>
							This will clear all denomination counts. Saved counts will be removed
							from this device.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							variant="destructive"
							onClick={() => {
								resetCashCount();
								form.reset(emptyCashCountValues);
								setShowResetModal(false);
							}}
						>
							Reset
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<XReadingReceiptDialog
				open={!!receiptMode}
				onClose={() => setReceiptMode(null)}
				mode={receiptMode}
				staffName={staffName}
				totals={{
					totalCashSales: data.totalCashSales,
					totalCashOut: data.totalCashOut,
					totalCashIn: data.totalCashIn,
				}}
				totalCashCounted={totalCashCounted}
				cashCount={cashCount}
			/>
		</>
	);
}
