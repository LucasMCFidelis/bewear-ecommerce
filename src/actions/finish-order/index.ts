"use server";

import { eq, ExtractTablesWithRelations } from "drizzle-orm";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { PgTransaction } from "drizzle-orm/pg-core";

import { getCartData } from "@/app/data/cart/get-cart-data";
import { getOneDirectBuy } from "@/app/data/direct-buy/get-one-direct-buy";
import { getOneProductVariant } from "@/app/data/product-variant/get-one-product-variant";
import { getOneShippingAddress } from "@/app/data/shippingAddress/get-one-shipping-address";
import { ShippingAddressDTO } from "@/app/data/shippingAddress/shipping-address-dto";
import { verifyUser } from "@/app/data/user/verify-user";
import { db } from "@/db";
import { orderItemTable, orderTable, productVariantTable } from "@/db/schema";
import * as Schema from "@/db/schema";

import { calculateShippingCost } from "../calculate-shipping-cost";

interface FinishOrderTransitionProps<
  TItems extends { productVariantId: string; quantity: number },
> {
  shippingAddress: ShippingAddressDTO;
  userId: string;
  userEmail: string;
  subtotalPriceInCents: number;
  shippingCost: number;
  totalPriceInCents: number;
  items: Array<TItems>;
  tx: PgTransaction<
    NodePgQueryResultHKT,
    typeof Schema,
    ExtractTablesWithRelations<typeof Schema>
  >;
}

async function finishOrderTransition<
  TItems extends { productVariantId: string; quantity: number },
>({
  userId,
  userEmail,
  shippingAddress,
  shippingCost,
  subtotalPriceInCents,
  totalPriceInCents,
  items,
  tx,
}: FinishOrderTransitionProps<TItems>) {
  if (!shippingAddress || !shippingAddress.id) {
    throw new Error("Shipping address not found");
  }
  const email = shippingAddress.email ?? userEmail;
  if (!email) throw new Error("Email required");
  if (!shippingAddress.cpfOrCnpj) {
    throw new Error("Invalid cpfOrCnpj: missing required field");
  }

  const [order] = await tx
    .insert(orderTable)
    .values({
      userId,
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
      shippingCostInCents: shippingCost,
      subtotalPriceInCents,
      totalPriceInCents,
      shippingAddressId: shippingAddress.id,
    })
    .returning();

  if (!order) {
    throw new Error("Failed to create order");
  }
  const orderId = order.id;

  const orderItemsPayload: Array<typeof orderItemTable.$inferInsert> = [];
  for (const item of items) {
    const productVariant = await getOneProductVariant({
      where: [{ field: "ID", value: item.productVariantId }],
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

  return orderId;
}

export const finishOrderToCart = async () => {
  const user = await verifyUser();

  const cart = await getCartData({
    userId: user.id,
    withShippingAddress: true,
    withItems: true,
    withProductVariant: true,
  });

  if (!cart || !cart.items || cart.items?.length === 0) {
    throw new Error("Cart not found or empty");
  }
  const shippingAddress = cart.shippingAddress!;
  const shippingCost = await calculateShippingCost({ typeDataBase: "to-cart" });
  const subtotalPriceInCents = cart.cartTotalInCents || 0;
  const totalPriceInCents =
    subtotalPriceInCents + shippingCost.data.freightInCents;

  let orderId: string | undefined;
  await db.transaction(async (tx) => {
    orderId = await finishOrderTransition({
      userId: user.id,
      userEmail: user.email,
      shippingAddress,
      items: cart.items,
      tx,
      subtotalPriceInCents,
      shippingCost: shippingCost.data.freightInCents,
      totalPriceInCents,
    });
  });

  if (!orderId) {
    throw new Error("Failed to create order");
  }

  return { orderId };
};

export const finishOrderToDirect = async ({
  directBuyId,
  shippingAddressId,
}: {
  directBuyId: string;
  shippingAddressId: string;
}) => {
  const user = await verifyUser();

  const directBuy = await getOneDirectBuy({
    withProduct: true,
    withVariant: true,
    where: [{ field: "ID", value: directBuyId }],
  });

  if (
    !directBuy ||
    directBuy.productVariant.quantityInStock < directBuy.quantity
  ) {
    throw new Error(
      "Product variant not found or Quantity required exceed quantity in stock "
    );
  }

  const shippingAddress = await getOneShippingAddress({
    userId: user.id,
    shippingAddressId,
  });
  const shippingCost = await calculateShippingCost({
    typeDataBase: "to-direct",
    directBuyId: directBuy.id,
  });
  const totalPriceInCents =
    directBuy.priceInCents + shippingCost.data.freightInCents;

  let orderId: string | undefined;
  await db.transaction(async (tx) => {
    orderId = await finishOrderTransition({
      userId: user.id,
      userEmail: user.email,
      shippingAddress,
      items: [
        {
          productVariantId: directBuy.productVariantId,
          quantity: directBuy.quantity,
        },
      ],
      tx,
      subtotalPriceInCents: directBuy.priceInCents,
      shippingCost: shippingCost.data.freightInCents,
      totalPriceInCents,
    });
  });

  if (!orderId) {
    throw new Error("Failed to create order");
  }

  return { orderId };
};
