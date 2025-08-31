"use server";

import { eq } from "drizzle-orm";

import { getCartData } from "@/app/data/cart/get-cart-data";
import { getOneShippingAddress } from "@/app/data/shippingAddress/get-one-shipping-address";
import { verifyUser } from "@/app/data/user/verify-user";
import { db } from "@/db";
import { cartTable } from "@/db/schema";

import {
  UpdateCartShippingAddressSchema,
  updateCartShippingAddressSchema,
} from "./schema";

export const updateCartShippingAddress = async (
  data: UpdateCartShippingAddressSchema
) => {
  updateCartShippingAddressSchema.parse(data);
  const user = await verifyUser();

  const [shippingAddress, cart] = await Promise.all([
    getOneShippingAddress({
      userId: user.id,
      shippingAddressId: data.shippingAddressId,
    }),
    getCartData({ userId: user.id }),
  ]);

  await db
    .update(cartTable)
    .set({
      shippingAddressId: shippingAddress.id,
    })
    .where(eq(cartTable.id, cart.id));

  return { success: true, shippingAddressId: shippingAddress.id };
};
