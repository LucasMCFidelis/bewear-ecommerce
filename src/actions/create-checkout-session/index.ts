"use server";

import { eq } from "drizzle-orm";
import Stripe from "stripe";

import { getCartData } from "@/app/data/cart/get-cart-data";
import { OrderItemDTO } from "@/app/data/order-item/order-item-dto";
import { verifyUser } from "@/app/data/user/verify-user";
import { db } from "@/db";
import { cartItemTable, cartTable, orderTable } from "@/db/schema";

import {
  CreateCheckoutSessionSchema,
  createCheckoutSessionSchema,
} from "./schema";

interface CreateCheckoutSessionProps {
  data: CreateCheckoutSessionSchema;
  shippingCostInCents: number;
  orderItems: Array<OrderItemDTO<true, true>>;
}

async function createCheckoutSession({
  data,
  orderItems,
  shippingCostInCents,
}: CreateCheckoutSessionProps) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe Secret key is not defined");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const newSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
    metadata: {
      orderId: data.orderId,
    },
    line_items: [
      {
        price_data: {
          currency: "brl",
          product_data: {
            name: "Frete",
            description: "Taxa de entrega dos produtos",
          },
          unit_amount: shippingCostInCents,
        },
        quantity: 1,
      },
      ...orderItems.map((orderItem) => {
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
    ],
  });

  return newSession;
}

export const createCheckoutSessionToCart = async (
  data: CreateCheckoutSessionSchema
) => {
  const { orderId } = createCheckoutSessionSchema.parse(data);

  const user = await verifyUser();

  const order = await db.query.orderTable.findFirst({
    where: (order, { eq, and }) =>
      and(eq(order.id, orderId), eq(order.userId, user.id)),
    with: { items: { with: { productVariant: { with: { product: true } } } } },
  });
  if (!order) throw new Error("Order not found or unauthorized");

  const checkoutSession = await db.transaction(async (tx) => {
    const cart = await getCartData({
      userId: user.id,
      withItems: true,
      withShippingAddress: true,
      withProductVariant: true,
      withProduct: true,
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart not found or empty");
    }

    const newSession = await createCheckoutSession({
      data,
      orderItems: order.items,
      shippingCostInCents: order.shippingCostInCents,
    });

    await Promise.all([
      tx
        .update(orderTable)
        .set({
          checkoutSessionId: newSession.id,
          checkoutSessionUrl: newSession.url,
        })
        .where(eq(orderTable.id, orderId)),
      tx.delete(cartTable).where(eq(cartTable.id, cart.id)),
      tx.delete(cartItemTable).where(eq(cartItemTable.cartId, cart.id)),
    ]);

    return newSession;
  });

  return checkoutSession;
};
