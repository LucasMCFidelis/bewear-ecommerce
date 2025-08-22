"use server";

import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { orderTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { DeleteUserOrderSchema, deleteUserOrderSchema } from "./schema";

export const deleteUserOrder = async (data: DeleteUserOrderSchema) => {
  deleteUserOrderSchema.parse(data);
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const order = await db.query.orderTable.findFirst({
    where: (order, { eq, and }) =>
      and(eq(order.id, data.orderId), eq(order.userId, session.user.id)),
  });
  if (!order) throw new Error("Order not found or unauthorized");

  await db.delete(orderTable).where(eq(orderTable.id, order.id));
};
