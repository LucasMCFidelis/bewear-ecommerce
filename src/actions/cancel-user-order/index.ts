"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { orderTable, productVariantTable } from "@/db/schema";
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

  await db.transaction(async (tx) => {
    const order = await tx.query.orderTable.findFirst({
      where: (order, { eq, and }) =>
        and(eq(order.id, data.orderId), eq(order.userId, session.user.id)),
      with: { items: true },
    });
    if (!order) throw new Error("Order not found or unauthorized");

    await tx
      .update(orderTable)
      .set({ status: "canceled" })
      .where(eq(orderTable.id, order.id));

    order.items.forEach(async (item) => {
      const productVariant = await tx.query.productVariantTable.findFirst({
        where: (productVariant, { eq }) =>
          eq(productVariant.id, item.productVariantId),
      });
      if (!productVariant) {
        throw new Error("Product variant not found ");
      }

      await tx
        .update(productVariantTable)
        .set({
          quantityInStock: productVariant.quantityInStock + item.quantity,
        })
        .where(eq(productVariantTable.id, productVariant.id));
    });
  });
};
