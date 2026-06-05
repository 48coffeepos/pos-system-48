"use client";

import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
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
import { stockroomDeductStockMutationOptions } from "../../mutationOptions";

interface StockroomDeductProps {
	item: { id: string; name: string; endingAdmin: number };
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

function StockroomDeduct({ item, open, onOpenChange }: StockroomDeductProps) {
	const { data: session } = authClient.useSession();

	const formSchema = useMemo(
		() =>
			z
				.object({
					quantity: z.number().int().min(1, "Must deduct at least 1 item"),
				})
				.superRefine((value, ctx) => {
					if (value.quantity > item.endingAdmin) {
						ctx.addIssue({
							code: "custom",
							path: ["quantity"],
							message: `Only ${item.endingAdmin} available in stockroom`,
						});
					}
				}),
		[item.endingAdmin],
	);

	const mutation = useMutation({
		...stockroomDeductStockMutationOptions,
		onSettled: () => {
			onOpenChange(false);
		},
	});

	const form = useAppForm({
		defaultValues: { quantity: 1 },
		validators: { onChange: formSchema },
		onSubmit: async ({ value }) => {
			if (!session?.user) return;
			mutation.mutate({
				itemId: item.id,
				quantity: value.quantity,
				itemName: item.name,
			});
		},
	});

	useEffect(() => {
		if (open) {
			form.reset({ quantity: 1 });
		}
	}, [open, item.id, form]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{item.name}</DialogTitle>
					<DialogDescription>
						<span className="font-bold text-red-500">Deduct stock</span> from{" "}
						<span className="font-bold text-red-500">stockroom</span> inventory.
						Available in stockroom:{" "}
						<span className="font-semibold text-(--deep-forest)">
							{item.endingAdmin}
						</span>
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
								label="Quantity to Deduct"
								placeholder="Enter quantity"
								min="1"
								step="1"
							/>
						)}
					</form.AppField>

					<DialogFooter className="mt-6">
						<DialogClose render={<Button variant="outline" />}>
							Cancel
						</DialogClose>
						<form.AppForm>
							<form.SubmitButton
								label={mutation.isPending ? "Deducting..." : "Save"}
							/>
						</form.AppForm>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export { StockroomDeduct };
export type { StockroomDeductProps };
