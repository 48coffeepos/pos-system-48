import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppForm } from "@/integrations/tanstack-form";
import { CashCountPanel } from "./CashCountPanel";
import { ReconciliationPanel } from "./ReconciliationPanel";
import { XReadingReceiptDialog } from "./XReadingReceiptDialog";
import { getCupSalesQueryOptions } from "../queryOptions";
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
	date: "today" | "yesterday";
	data: {
		totalCashSales: number;
		totalGcashSales: number;
		totalGrabSales: number;
		totalCashOut: number;
		totalCashIn: number;
		totalExpenses: number;
	};
}

import { useNavigate } from "@tanstack/react-router";

export function XReadingScreen({ date, data }: XReadingScreenProps) {
	const navigate = useNavigate({ from: "/staff/xreading" });
	const { data: session } = authClient.useSession();
	const staffName = session?.user?.name || "Staff";

	const cashCount = useXReadingStore((state) => state.cashCount);
	const resetCashCount = useXReadingStore((state) => state.resetCashCount);

	const [showResetModal, setShowResetModal] = useState(false);
	const [receiptMode, setReceiptMode] = useState<
		"sales" | "cashcount" | "cups" | null
	>(null);

	const { data: cupSales = [] } = useQuery(getCupSalesQueryOptions(date));

	const form = useAppForm({
		defaultValues: cashCount,
	});

	useEffect(() => {
		const syncFormFromStore = () => {
			form.reset(useXReadingStore.getState().cashCount);
		};

		if (useXReadingStore.persist.hasHydrated()) {
			syncFormFromStore();
		}

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

	const handleExportCups = () => {
		setReceiptMode("cups");
	};

	return (
		<>
			{/* Date Toggle */}
			<div className="mb-4 flex print:hidden">
				<div className="inline-flex rounded-xl border border-(--light-gray) bg-(--pure-white) p-1 shadow-sm">
					<button
						type="button"
						onClick={() => navigate({ search: { date: "today" } })}
						className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
							date === "today"
								? "bg-(--forest-green) text-(--pale-yellow) shadow-sm"
								: "text-(--medium-gray) hover:text-(--near-black)"
						}`}
					>
						Today
					</button>
					<button
						type="button"
						onClick={() => navigate({ search: { date: "yesterday" } })}
						className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
							date === "yesterday"
								? "bg-(--forest-green) text-(--pale-yellow) shadow-sm"
								: "text-(--medium-gray) hover:text-(--near-black)"
						}`}
					>
						Yesterday
					</button>
				</div>
			</div>

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
						totalGcashSales: data.totalGcashSales,
						totalCashOut: data.totalCashOut,
						totalCashIn: data.totalCashIn,
						totalExpenses: data.totalExpenses,
					}}
					totalCashCounted={totalCashCounted}
					onExportSales={handleExportSales}
					onExportCashCount={handleExportCashCount}
					onExportCups={handleExportCups}
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
					totalGcashSales: data.totalGcashSales,
					totalCashOut: data.totalCashOut,
					totalCashIn: data.totalCashIn,
					totalExpenses: data.totalExpenses,
				}}
				totalCashCounted={totalCashCounted}
				cashCount={cashCount}
				cupSales={cupSales}
				date={date}
			/>
		</>
	);
}
