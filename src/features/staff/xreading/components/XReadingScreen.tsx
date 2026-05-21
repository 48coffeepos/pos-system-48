import { useState } from "react";
import { useAppForm } from "@/integrations/tanstack-form";
import { CashCountPanel } from "./CashCountPanel";
import { ReconciliationPanel } from "./ReconciliationPanel";
import { XReadingReceiptDialog } from "./XReadingReceiptDialog";
import { authClient } from "@/integrations/better-auth/auth-client";
import { useStore } from "@tanstack/react-form";
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

interface XReadingScreenProps {
	data: {
		totalCashSales: number;
		totalExpenses: number;
	};
}

export type CashCountValues = {
	1: number;
	5: number;
	10: number;
	20: number;
	50: number;
	100: number;
	200: number;
	500: number;
	1000: number;
};



export function XReadingScreen({ data }: XReadingScreenProps) {
	const { data: session } = authClient.useSession();
	const staffName = session?.user?.name || "Staff";
	
	const [isLocked, setIsLocked] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [receiptMode, setReceiptMode] = useState<"sales" | "cashcount" | null>(null);

	const form = useAppForm({
		defaultValues: {
			1: 0,
			5: 0,
			10: 0,
			20: 0,
			50: 0,
			100: 0,
			200: 0,
			500: 0,
			1000: 0,
		} as CashCountValues,
		onSubmit: async () => {
			if (!isLocked) {
				setShowConfirmModal(true);
			}
		},
	});

	const formValues = useStore(form.store, (state: any) => state.values as CashCountValues);

	const totalCashCounted = Object.entries(formValues).reduce(
		(sum, [denom, qty]) => sum + Number(denom) * (qty as number),
		0,
	);

	const handleExportSales = () => {
		setReceiptMode("sales");
	};

	const handleExportCashCount = () => {
		setReceiptMode("cashcount");
	};

	const handlePrint = () => {
		window.print();
	};

	return (
		<>
			{/* On-screen UI */}
			<div className="grid grid-cols-1 gap-8 print:hidden lg:grid-cols-2">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<form.AppForm>
						<CashCountPanel 
							form={form}
							totalCashCounted={totalCashCounted} 
							isLocked={isLocked}
						/>
					</form.AppForm>
				</form>

				<ReconciliationPanel
					totalCashSales={data.totalCashSales}
					totalExpenses={data.totalExpenses}
					totalCashCounted={totalCashCounted}
					onExportSales={handleExportSales}
					onExportCashCount={handleExportCashCount}
				/>
			</div>

			<AlertDialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
				<AlertDialogContent size="sm">
					<AlertDialogHeader>
						<AlertDialogTitle>Lock Cash Count?</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to confirm this cash count? This will lock the inputs for this session.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								setIsLocked(true);
								setShowConfirmModal(false);
							}}
						>
							Confirm
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<XReadingReceiptDialog
				open={!!receiptMode}
				onClose={() => setReceiptMode(null)}
				onPrint={handlePrint}
				mode={receiptMode}
				staffName={staffName}
				totalCashSales={data.totalCashSales}
				totalExpenses={data.totalExpenses}
				totalCashCounted={totalCashCounted}
				cashCount={formValues}
			/>
		</>
	);
}
