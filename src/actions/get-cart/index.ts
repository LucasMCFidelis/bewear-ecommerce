"use server";

import { verifyUser } from "@/app/data/user/verify-user";
import { db } from "@/db";
import { cartTable } from "@/db/schema";

export const getCart = async () => {
  const user = await verifyUser();

  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, user.id),
    with: {
      shippingAddress: true,
      items: {
        with: {
          productVariant: { with: { product: true } },
        },
      },
    },
  });

  if (!cart) {
    const [newCart] = await db
      .insert(cartTable)
      .values({ userId: user.id })
      .returning();
    return {
      ...newCart,
      items: [],
      totalPriceInCents: 0,
      shippingAddress: null,
    };
  }

  return {
    ...cart,
    totalPriceInCents: cart.items.reduce(
      (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
      0
    ),
  };
};
