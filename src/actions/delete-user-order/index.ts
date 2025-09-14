"use server";

import { eq } from "drizzle-orm";

import { getOneUserOrder } from "@/app/data/orders/get-one-user-order";
import { verifyUser } from "@/app/data/user/verify-user";
import { db } from "@/db";
import { orderTable } from "@/db/schema";

import { DeleteUserOrderSchema, deleteUserOrderSchema } from "./schema";

export const deleteUserOrder = async (data: DeleteUserOrderSchema) => {
  deleteUserOrderSchema.parse(data);
  const user = await verifyUser();

  const order = await getOneUserOrder({
    userId: user.id,
    where: [
      { field: "ID", value: data.orderId },
      { field: "USER_ID", value: user.id },
    ],
  });
  if (!order) throw new Error("Order not found or unauthorized");

  await db.delete(orderTable).where(eq(orderTable.id, order.id));
};
