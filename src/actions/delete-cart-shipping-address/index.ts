"use server";

import { eq } from "drizzle-orm";

import { getOneShippingAddress } from "@/app/data/shippingAddress/get-one-shipping-address";
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

  const shippingAddress = await getOneShippingAddress({
    userId: user.id,
    shippingAddressId: data.shippingAddressId,
  });

  await db
    .delete(shippingAddressTable)
    .where(eq(shippingAddressTable.id, shippingAddress.id));

  return { success: true };
};
