import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";

export const updateOrderPaymentInput = z.object({
  orderId: z.string(),
  method: z.enum(["CASH", "GCASH", "GRAB"]),
  amount_tendered: z.number().min(0),
  reference_number: z.string().optional(),
});

export const updateOrderPayment = createServerFn({ method: "POST" })
  .middleware([adminAuthMiddleware()])
  .inputValidator(updateOrderPaymentInput)
  .handler(async ({ data }) => {
    const order = await prisma.order.findUnique({
      where: { order_id: data.orderId },
      select: { grand_total: true },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    const grandTotal = Number(order.grand_total);
    const changeAmount =
      data.method === "CASH"
        ? Math.max(0, data.amount_tendered - grandTotal)
        : 0;

    const updated = await prisma.order.update({
      where: { order_id: data.orderId },
      data: {
        method: data.method,
        amount_tendered: data.amount_tendered,
        change_amount: changeAmount,
        reference_number: data.reference_number || null,
      },
      select: { order_id: true },
    });

    return { success: true, orderId: updated.order_id };
  });
