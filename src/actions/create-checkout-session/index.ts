"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import Stripe from "stripe";

import { db } from "@/db";
import { cartItemTable, cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import {
  CreateCheckoutSessionSchema,
  createCheckoutSessionSchema,
} from "./schema";

export const createCheckoutSession = async (
  data: CreateCheckoutSessionSchema
) => {
  const { orderId } = createCheckoutSessionSchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const order = await db.query.orderTable.findFirst({
    where: (order, { eq, and }) =>
      and(eq(order.id, orderId), eq(order.userId, session.user.id)),
    with: { items: { with: { productVariant: { with: { product: true } } } } },
  });
  if (!order) throw new Error("Order not found or unauthorized");

  const checkoutSession = await db.transaction(async (tx) => {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe Secret key is not defined");
    }
    const cart = await tx.query.cartTable.findFirst({
      where: (cart, { eq }) => eq(cart.userId, session.user.id),
      with: {
        shippingAddress: true,
        items: {
          with: {
            productVariant: { with: { product: true } },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart not found or empty");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const newSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      metadata: {
        orderId,
      },
      line_items: order.items.map((orderItem) => {
        return {
          price_data: {
            currency: "brl",
            product_data: {
              name: `${orderItem.productVariant.product.name} - ${orderItem.productVariant.name}`,
              description: orderItem.productVariant.product.description,
              images: [orderItem.productVariant.imageUrl],
            },
            // Em centavos
            unit_amount: orderItem.priceInCents,
          },
          quantity: orderItem.quantity,
        };
      }),
    });

    await Promise.all([
      tx.delete(cartTable).where(eq(cartTable.id, cart.id)),
      tx.delete(cartItemTable).where(eq(cartItemTable.cartId, cart.id)),
    ]);

    return newSession;
  });

  return checkoutSession;
};
