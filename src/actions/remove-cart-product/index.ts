"use server";

import { eq } from "drizzle-orm";
import z from "zod";

import { verifyUser } from "@/app/data/user/verify-user";
import { db } from "@/db";
import { cartItemTable } from "@/db/schema";

import { removeProductFromCartSchema } from "./schema";

export const removeProductFromCart = async (
  data: z.infer<typeof removeProductFromCartSchema>
) => {
  removeProductFromCartSchema.parse(data);
  const user = await verifyUser();

  const cartItem = await db.query.cartItemTable.findFirst({
    where: (cartItem, { eq }) => eq(cartItem.id, data.cartItemId),
    with: {
      cart: true,
    },
  });
  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  const cartDoesNotBelongToUser = cartItem.cart.userId !== user.id;
  if (cartDoesNotBelongToUser) {
    throw new Error("Unauthorized");
  }

  await db.delete(cartItemTable).where(eq(cartItemTable.id, cartItem.id));
};
