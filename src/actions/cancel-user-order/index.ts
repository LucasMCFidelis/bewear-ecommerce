"use server";

import { eq, ExtractTablesWithRelations } from "drizzle-orm";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { PgTransaction } from "drizzle-orm/pg-core";
import Stripe from "stripe";

import { getOneProductVariant } from "@/app/data/product-variant/get-one-product-variant";
import { verifyUser } from "@/app/data/user/verify-user";
import { db } from "@/db";
import { orderTable, productVariantTable } from "@/db/schema";
import * as Schema from "@/db/schema";

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
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe Secret key is not defined");
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
  if (!order.checkoutSessionId)
    throw new Error("Order haven't Checkout Session associated");

  await Promise.all([
    tx
      .update(orderTable)
      .set({
        status: "canceled",
        checkoutSessionId: null,
        checkoutSessionUrl: null,
      })
      .where(eq(orderTable.id, order.id)),
    stripe.checkout.sessions.expire(order.checkoutSessionId),
    order.items.forEach(async (item) => {
      const productVariant = await getOneProductVariant({
        where: [{ field: "id", value: item.productVariantId }],
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
    }),
  ]);
};

export const cancelUserOrder = async (data: CancelUserOrderSchema) => {
  const user = await verifyUser();

  await db.transaction(async (tx) => {
    await cancelOrderTransition({ data, userId: user.id, tx });
  });
};
