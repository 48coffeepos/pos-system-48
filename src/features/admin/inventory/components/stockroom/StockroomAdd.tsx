"use client";

import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { authClient } from "@/integrations/better-auth/auth-client";
import { useAppForm } from "@/integrations/tanstack-form";
import { stockroomAddStockMutationOptions } from "../../mutationOptions";

interface StockroomAddProps {
	item: { id: string; name: string; costPrice: number };
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

function createFormSchema() {
	return z.object({
		quantity: z.number().int().min(1, "Must add at least 1 item"),
		unitPrice: z.number().min(0, "Unit price must be 0 or greater"),
	});
}

function StockroomAdd({ item, open, onOpenChange }: StockroomAddProps) {
	const { data: session } = authClient.useSession();

	const mutation = useMutation({
		...stockroomAddStockMutationOptions,
		onSettled: () => {
			onOpenChange(false);
		},
	});

	const form = useAppForm({
		defaultValues: { quantity: 1, unitPrice: item.costPrice },
		validators: { onChange: createFormSchema() },
		onSubmit: async ({ value }) => {
			if (!session?.user) return;
			mutation.mutate({
				itemId: item.id,
				quantity: value.quantity,
				unitPrice: value.unitPrice,
				itemName: item.name,
			});
		},
	});

	useEffect(() => {
		if (open) {
			form.reset({ quantity: 1, unitPrice: item.costPrice });
		}
	}, [open, item.id, item.costPrice, form]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{item.name}</DialogTitle>
					<DialogDescription>
						<span className="font-bold text-red-500">IN stock</span> to{" "}
						<span className="font-bold text-red-500">stockroom</span> inventory
					</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<form.AppField name="quantity">
						{(field) => (
							<field.NumberField
								label="Quantity"
								placeholder="Enter quantity"
								min="1"
								step="1"
							/>
						)}
					</form.AppField>

					<div className="mt-4">
						<form.AppField name="unitPrice">
							{(field) => (
								<field.NumberField
									label="Unit price (₱)"
									placeholder="Enter unit price"
									min="0"
									step="0.01"
								/>
							)}
						</form.AppField>
					</div>

					<DialogFooter className="mt-6">
						<DialogClose render={<Button variant="outline" />}>
							Cancel
						</DialogClose>
						<form.AppForm>
							<form.SubmitButton
								label={mutation.isPending ? "Adding..." : "Save"}
							/>
						</form.AppForm>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export { StockroomAdd };
export type { StockroomAddProps };
