"use server";

import { eq } from "drizzle-orm";

import { getOneCartItem } from "@/app/data/cart-item/get-one-cart-item";
import { verifyUser } from "@/app/data/user/verify-user";
import { db } from "@/db";
import { cartItemTable } from "@/db/schema";

import {
  type DecreaseCartProductQuantitySchema,
  decreaseCartProductQuantitySchema,
} from "./schema";

const decreaseCartProductQuantity = async (
  data: DecreaseCartProductQuantitySchema
) => {
  decreaseCartProductQuantitySchema.parse(data);
  const user = await verifyUser();

  const cartItem = await getOneCartItem({
    where: [{ field: "id", value: data.cartItemId }],
    withCart: true,
  });
  if (!cartItem) throw new Error("Cart item not found");

  const cartDoesNotBelongToUser = cartItem.cart.userId !== user.id;
  if (cartDoesNotBelongToUser) {
    throw new Error("Unauthorized");
  }

  if (cartItem.quantity === 1) {
    await db.delete(cartItemTable).where(eq(cartItemTable.id, cartItem.id));
    return;
  }
  await db
    .update(cartItemTable)
    .set({ quantity: cartItem.quantity - 1 })
    .where(eq(cartItemTable.id, cartItem.id));
};

export default decreaseCartProductQuantity;
