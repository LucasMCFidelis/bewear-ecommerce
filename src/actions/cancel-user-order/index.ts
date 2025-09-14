"use server";

import { eq, ExtractTablesWithRelations } from "drizzle-orm";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { PgTransaction } from "drizzle-orm/pg-core";
import Stripe from "stripe";

import { OrderFields } from "@/app/data/columns";
import { WhereCondition } from "@/app/data/mount-where-clause";
import { getOneUserOrder } from "@/app/data/orders/get-one-user-order";
import { getOneProductVariant } from "@/app/data/product-variant/get-one-product-variant";
import { verifyUser } from "@/app/data/user/verify-user";
import { db } from "@/db";
import { orderTable, productVariantTable } from "@/db/schema";
import * as Schema from "@/db/schema";

import { CancelUserOrderSchema, cancelUserOrderSchema } from "./schema";

type OrdersColumns = typeof OrderFields;
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

  const where: Array<WhereCondition<OrdersColumns>> = [
    { field: "ID" as keyof OrdersColumns, value: data.orderId },
    ...(userId
      ? [{ field: "USER_ID" as keyof OrdersColumns, value: userId }]
      : []),
  ];

  const order = await getOneUserOrder({
    userId: userId ?? "",
    where,
    withItems: true,
  });

  if (!order || !order.items)
    throw new Error("Order not found or Unauthorized");
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
        where: [{ field: "ID", value: item.productVariantId }],
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
