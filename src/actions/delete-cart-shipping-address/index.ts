"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import {
  DeleteCartShippingAddressSchema,
  deleteCartShippingAddressSchema,
} from "./schema";

export const deleteCartShippingAddress = async (
  data: DeleteCartShippingAddressSchema
) => {
  deleteCartShippingAddressSchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const shippingAddress = await db.query.shippingAddressTable.findFirst({
    where: (shippingAddress, { eq, and }) =>
      and(
        eq(shippingAddress.id, data.shippingAddressId),
        eq(shippingAddress.userId, session.user.id)
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
