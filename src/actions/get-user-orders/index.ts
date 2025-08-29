"use server";

import { desc, eq } from "drizzle-orm";

import { verifyUser } from "@/app/data/user/verify-user";
import { db } from "@/db";
import { orderTable } from "@/db/schema";

export const getUserOrders = async () => {
  const user = await verifyUser();

  const orders = await db.query.orderTable.findMany({
    orderBy: [desc(orderTable.createdAt)],
    where: eq(orderTable.userId, user.id),
    with: {
      items: { with: { productVariant: { with: { product: true } } } },
      shippingAddress: true,
    },
  });

  return orders;
};
