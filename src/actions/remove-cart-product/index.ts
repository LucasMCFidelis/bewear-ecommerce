"use server";

import { eq } from "drizzle-orm";
import z from "zod";

import { getOneCartItem } from "@/app/data/cart-item/get-one-cart-item";
import { verifyUser } from "@/app/data/user/verify-user";
import { db } from "@/db";
import { cartItemTable } from "@/db/schema";

import { removeProductFromCartSchema } from "./schema";

export const removeProductFromCart = async (
  data: z.infer<typeof removeProductFromCartSchema>
) => {
  removeProductFromCartSchema.parse(data);
  const user = await verifyUser();

  const cartItem = await getOneCartItem({
    where: [{ field: "ID", value: data.cartItemId }],
    withCart: true,
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
