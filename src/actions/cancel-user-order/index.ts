"use server";

import { eq, ExtractTablesWithRelations } from "drizzle-orm";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { PgTransaction } from "drizzle-orm/pg-core";
import { headers } from "next/headers";

import { db } from "@/db";
import { orderTable, productVariantTable } from "@/db/schema";
import * as Schema from "@/db/schema";
import { auth } from "@/lib/auth";

import { CancelUserOrderSchema, cancelUserOrderSchema } from "./schema";

interface cancelOrderTransitionProps {
  data: CancelUserOrderSchema;
  userId: string | null;
  tx: PgTransaction<
    NodePgQueryResultHKT,
    typeof Schema,
    ExtractTablesWithRelations<typeof Schema>
  >;
}

export const cancelOrderTransition = async ({
  data,
  userId,
  tx,
}: cancelOrderTransitionProps) => {
  cancelUserOrderSchema.parse(data);
  const order = await tx.query.orderTable.findFirst({
    where: (order, { eq, and }) => {
      if (userId) {
        return and(eq(order.id, data.orderId), eq(order.userId, userId));
      } else {
        return eq(order.id, data.orderId);
      }
    },
    with: { items: true },
  });
  if (!order) throw new Error("Order not found or Unauthorized");

  await tx
    .update(orderTable)
    .set({ status: "canceled", checkoutSessionUrl: null })
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
};

export const cancelUserOrder = async (data: CancelUserOrderSchema) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await db.transaction(async (tx) => {
    await cancelOrderTransition({ data, userId: session.user.id, tx });
  });
};
