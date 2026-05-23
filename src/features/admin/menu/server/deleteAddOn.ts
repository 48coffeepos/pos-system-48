import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { prisma } from "@/integrations/prisma/db";

export const deleteAddOnInput = z.object({
  id: z.string().min(1),
});

export const deleteAddOn = createServerFn({ method: "POST" })
  .inputValidator(deleteAddOnInput)
  .handler(async ({ data }) => {
    const existing = await prisma.addon.findUnique({
      where: { addon_id: data.id },
    });

    if (!existing) {
      throw new Error("Add-on not found.");
    }

    await prisma.addon.delete({
      where: { addon_id: data.id },
    });

    return { success: true };
  });
