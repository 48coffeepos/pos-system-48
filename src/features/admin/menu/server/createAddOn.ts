import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { Prisma } from "@/generated/prisma/client.js";
import { prisma } from "@/integrations/prisma/db";

export const CreateAddOnSchema = z.object({
  name: z.string().trim().min(1, "Add-on name is required").max(20, "Add-on name must be 20 characters or fewer"),
  amount: z.number({ error: "Amount is required" }).min(0, "Amount must be zero or more"),
});

export const createAddOn = createServerFn({ method: "POST" })
  .middleware([adminAuthMiddleware()])
  .inputValidator(CreateAddOnSchema)
  .handler(async ({ data }) => {
    try {
      const addOn = await prisma.addon.create({
        data: {
          name: data.name,
          price: data.amount,
        },
      });

      return {
        id: addOn.addon_id,
        name: addOn.name,
        amount: Number(addOn.price),
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new Error(`The add-on name "${data.name}" already exists. Try a different name.`);
      }
      throw error;
    }
  });
