"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import {
  cartItemTable,
  cartTable,
  orderItemTable,
  orderTable,
} from "@/db/schema";
import { auth } from "@/lib/auth";

import { calculateShippingCost } from "../calculate-shipping-cost";

export const finishOrder = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
    with: {
      shippingAddress: true,
      items: {
        with: {
          productVariant: true,
        },
      },
    },
  });

  await db.transaction(async (tx) => {
    if (!cart) {
      throw new Error("Cart not found");
    }
    if (!cart.shippingAddress) {
      throw new Error("Shipping address not found");
    }

    const shippingCost = await calculateShippingCost();
    const totalPriceInCents = cart.items.reduce(
      (acc, item) =>
        acc + item.productVariant.priceInCents * item.quantity,
      shippingCost.data.freightInCents
    );
    const [order] = await tx
      .insert(orderTable)
      .values({
        email: cart.shippingAddress.email,
        zipCode: cart.shippingAddress.zipCode,
        country: cart.shippingAddress.country,
        phone: cart.shippingAddress.phone,
        cpfOrCnpj: cart.shippingAddress.cpfOrCnpj,
        city: cart.shippingAddress.city,
        complement: cart.shippingAddress.complement,
        neighborhood: cart.shippingAddress.neighborhood,
        number: cart.shippingAddress.number,
        recipientName: cart.shippingAddress.recipientName,
        state: cart.shippingAddress.state,
        street: cart.shippingAddress.street,
        userId: session.user.id,
        shippingCostInCents: shippingCost.data.freightInCents,
        totalPriceInCents,
        shippingAddressId: cart.shippingAddress!.id,
      })
      .returning();
    if (!order) {
      throw new Error("Failed to create order");
    }

    const orderItensPayload: Array<typeof orderItemTable.$inferInsert> =
      cart.items.map((item) => ({
        orderId: order.id,
        productVariantId: item.productVariantId,
        quantity: item.quantity,
        priceInCents: item.productVariant.priceInCents,
      }));

    await Promise.all([
      tx.insert(orderItemTable).values(orderItensPayload),
      tx.delete(cartTable).where(eq(cartTable.id, cart.id)),
      tx.delete(cartItemTable).where(eq(cartItemTable.cartId, cart.id)),
    ]);
  });
};
