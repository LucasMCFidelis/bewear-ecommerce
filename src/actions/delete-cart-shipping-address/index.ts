"use server";

import { eq } from "drizzle-orm";

import { verifyUser } from "@/app/data/user/verify-user";
import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";

import {
  DeleteCartShippingAddressSchema,
  deleteCartShippingAddressSchema,
} from "./schema";

export const deleteCartShippingAddress = async (
  data: DeleteCartShippingAddressSchema
) => {
  deleteCartShippingAddressSchema.parse(data);

  const user = await verifyUser();

  const shippingAddress = await db.query.shippingAddressTable.findFirst({
    where: (shippingAddress, { eq, and }) =>
      and(
        eq(shippingAddress.id, data.shippingAddressId),
        eq(shippingAddress.userId, user.id)
      ),
  });

  if (!shippingAddress) {
    throw new Error("Shipping address not found or unauthorized");
  }

  await db
    .delete(shippingAddressTable)
    .where(eq(shippingAddressTable.id, shippingAddress.id));

  return { success: true };
};
