import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";

export const deleteMenuInput = z.object({
  id: z.string().min(1),
});

export const deleteMenu = createServerFn({ method: "POST" })
  .middleware([adminAuthMiddleware()])
  .inputValidator(deleteMenuInput)
  .handler(async ({ data }) => {
    const existingMenu = await prisma.menu.findUnique({
      where: { menu_id: data.id },
    });

    if (!existingMenu) {
      throw new Error("Menu item not found.");
    }

    await prisma.menu.delete({
      where: { menu_id: data.id },
    });

    return { success: true };
  });
