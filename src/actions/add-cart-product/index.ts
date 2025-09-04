"use server";

import { eq } from "drizzle-orm";

import { getCartData } from "@/app/data/cart/get-cart-data";
import { getOneCartItem } from "@/app/data/cart-item/get-one-cart-item";
import { getOneProductVariant } from "@/app/data/product-variant/get-one-product-variant";
import { verifyUser } from "@/app/data/user/verify-user";
import { db } from "@/db";
import { cartItemTable, cartTable, productVariantTable } from "@/db/schema";

import { AddProductToCartSchema, addProductToCartSchema } from "./schema";

export const addProductToCart = async (data: AddProductToCartSchema) => {
  addProductToCartSchema.parse(data);
  const user = await verifyUser();

  const productVariant = await getOneProductVariant({
    where: [{ field: "ID", value: data.productVariantId }],
  });
  if (!productVariant) {
    throw new Error("Product variant not found");
  }

  const cart = await getCartData({
    userId: user.id,
  });
  if (!cart) throw new Error("Cart is not found");

  let cartId = cart.id;
  if (!cartId) {
    const [newCart] = await db
      .insert(cartTable)
      .values({
        userId: user.id,
      })
      .returning();
    cartId = newCart.id;
  }

  function checkLimitQuantity({
    quantity,
    productVariant,
  }: {
    quantity: number;
    productVariant: typeof productVariantTable.$inferSelect;
  }) {
    if (quantity > productVariant.quantityInStock)
      throw new Error("Quantity required exceed  quantity in stock");
  }

  const cartItem = await getOneCartItem({
    where: [
      { field: "CART_ID", value: cartId },
      { field: "PRODUCT_VARIANT_ID", value: data.productVariantId },
    ],
  });
  if (cartItem) {
    const totalQuantity = cartItem.quantity + data.quantity;
    checkLimitQuantity({ quantity: totalQuantity, productVariant });
    await db
      .update(cartItemTable)
      .set({
        quantity: totalQuantity,
      })
      .where(eq(cartItemTable.id, cartItem.id));
    return;
  }

  checkLimitQuantity({ quantity: data.quantity, productVariant });
  await db.insert(cartItemTable).values({
    cartId,
    productVariantId: data.productVariantId,
    quantity: data.quantity,
  });
};
