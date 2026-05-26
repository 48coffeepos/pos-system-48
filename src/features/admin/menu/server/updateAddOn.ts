import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { Prisma } from "@/generated/prisma/client.js";
import { prisma } from "@/integrations/prisma/db";

export const UpdateAddOnSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, "Add-on name is required").max(20, "Add-on name must be 20 characters or fewer"),
  amount: z.number({ error: "Amount is required" }).min(0, "Amount must be zero or more"),
});

export const updateAddOn = createServerFn({ method: "POST" })
  .middleware([adminAuthMiddleware()])
  .inputValidator(UpdateAddOnSchema)
  .handler(async ({ data }) => {
    const existing = await prisma.addon.findUnique({
      where: { addon_id: data.id },
    });

    if (!existing) {
      throw new Error("Add-on not found.");
    }

    try {
      const updated = await prisma.addon.update({
        where: { addon_id: data.id },
        data: {
          name: data.name,
          price: data.amount,
        },
      });

      return {
        id: updated.addon_id,
        name: updated.name,
        amount: Number(updated.price),
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new Error(`The add-on name "${data.name}" already exists. Try a different name.`);
      }
      throw error;
    }
  });
