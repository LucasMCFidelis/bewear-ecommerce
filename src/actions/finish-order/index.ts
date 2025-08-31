"use server";

import { eq } from "drizzle-orm";

import { getCartData } from "@/app/data/cart/get-cart-data";
import { verifyUser } from "@/app/data/user/verify-user";
import { db } from "@/db";
import { orderItemTable, orderTable, productVariantTable } from "@/db/schema";

import { calculateShippingCost } from "../calculate-shipping-cost";

export const finishOrder = async () => {
  const user = await verifyUser();

  const cart = await getCartData({
    userId: user.id,
    withShippingAddress: true,
    withItems: true,
    withProductVariant: true,
  });

  let orderId: string | undefined;
  await db.transaction(async (tx) => {
    if (!cart || !cart.items || cart.items?.length === 0) {
      throw new Error("Cart not found or empty");
    }
    const shippingAddress = cart.shippingAddress!;
    if (!shippingAddress || !shippingAddress.id) {
      throw new Error("Shipping address not found");
    }
    const email = shippingAddress.email ?? user.email;
    if (!email) throw new Error("Email required");
    if (!shippingAddress.cpfOrCnpj) {
      throw new Error("Invalid cpfOrCnpj: missing required field");
    }

    const shippingCost = await calculateShippingCost();
    const subtotalPriceInCents = cart.cartTotalInCents || 0;
    const totalPriceInCents =
      subtotalPriceInCents + shippingCost.data.freightInCents;

    const [order] = await tx
      .insert(orderTable)
      .values({
        userId: user.id,
        email,
        phone: shippingAddress.phone,
        cpfOrCnpj: shippingAddress.cpfOrCnpj,
        zipCode: shippingAddress.zipCode,
        country: shippingAddress.country,
        city: shippingAddress.city,
        neighborhood: shippingAddress.neighborhood,
        street: shippingAddress.street,
        number: shippingAddress.number,
        complement: shippingAddress.complement ?? null,
        recipientName: shippingAddress.recipientName,
        state: shippingAddress.state,
        shippingCostInCents: shippingCost.data.freightInCents,
        subtotalPriceInCents,
        totalPriceInCents,
        shippingAddressId: shippingAddress.id,
      })
      .returning();

    if (!order) {
      throw new Error("Failed to create order");
    }
    orderId = order.id;

    const orderItemsPayload: Array<typeof orderItemTable.$inferInsert> = [];
    for (const item of cart.items) {
      const productVariant = await tx.query.productVariantTable.findFirst({
        where: (productVariant, { eq }) =>
          eq(productVariant.id, item.productVariantId),
      });

      if (!productVariant || productVariant.quantityInStock < item.quantity) {
        throw new Error(
          "Product variant not found or Quantity required exceed quantity in stock "
        );
      }

      await tx
        .update(productVariantTable)
        .set({
          quantityInStock: productVariant.quantityInStock - item.quantity,
        })
        .where(eq(productVariantTable.id, productVariant.id));

      orderItemsPayload.push({
        orderId: order.id,
        productVariantId: productVariant.id,
        quantity: item.quantity,
        priceInCents: productVariant.priceInCents,
      });
    }

    if (orderItemsPayload.length > 0) {
      await tx.insert(orderItemTable).values(orderItemsPayload);
    }
  });

  if (!orderId) {
    throw new Error("Failed to create order");
  }

  return { orderId };
};
