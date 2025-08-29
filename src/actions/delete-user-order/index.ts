"use server";

import { eq } from "drizzle-orm";

import { verifyUser } from "@/app/data/user/verify-user";
import { db } from "@/db";
import { orderTable } from "@/db/schema";

import { DeleteUserOrderSchema, deleteUserOrderSchema } from "./schema";

export const deleteUserOrder = async (data: DeleteUserOrderSchema) => {
  deleteUserOrderSchema.parse(data);
  const user = await verifyUser();

  const order = await db.query.orderTable.findFirst({
    where: (order, { eq, and }) =>
      and(eq(order.id, data.orderId), eq(order.userId, user.id)),
  });
  if (!order) throw new Error("Order not found or unauthorized");

  await db.delete(orderTable).where(eq(orderTable.id, order.id));
};
