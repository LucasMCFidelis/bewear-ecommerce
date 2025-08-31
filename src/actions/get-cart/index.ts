"use server";

import { CartDTO } from "@/app/data/cart/cart-dto";
import { getCartData } from "@/app/data/cart/get-cart-data";
import { verifyUser } from "@/app/data/user/verify-user";
import { db } from "@/db";
import { cartTable } from "@/db/schema";

export const getCart = async (): Promise<CartDTO> => {
  const user = await verifyUser();

  const cart = await getCartData({
    userId: user.id,
    withShippingAddress: true,
    withItems: true,
    withProductVariant: true,
    withProduct: true,
  });

  if (!cart) {
    const [newCart] = await db
      .insert(cartTable)
      .values({ userId: user.id })
      .returning();
    return {
      ...newCart,
      items: [],
      cartTotalInCents: 0,
      shippingAddress: null,
    };
  }

  return cart;
};
