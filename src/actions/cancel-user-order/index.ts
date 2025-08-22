"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { orderTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { CancelUserOrderSchema, cancelUserOrderSchema } from "./schema";

export const cancelUserOrder = async (data: CancelUserOrderSchema) => {
  cancelUserOrderSchema.parse(data);
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

  await db
    .update(orderTable)
    .set({ status: "canceled" })
    .where(eq(orderTable.id, order.id));
};
