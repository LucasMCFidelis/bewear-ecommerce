import { cartItemTable, cartTable, productVariantTable } from "@/db/schema";

import { CartItemsDTO } from "./cart-items-dto";

export function mapToCartItemDTO<
  WithCart extends boolean = false,
  WithVariant extends boolean = false,
>(
  data: typeof cartItemTable.$inferSelect & {cart: typeof cartTable.$inferSelect} & {productVariant: typeof productVariantTable.$inferSelect},
  withCart?: WithCart,
  withVariant?: WithVariant
): CartItemsDTO<WithCart, WithVariant> {
  const base = {
    id: data.id,
    createdAt: new Date(data.createdAt),
    cartId: data.cartId,
    productVariantId: data.productVariantId,
    quantity: data.quantity,
  };

  return {
    ...base,
    ...(withCart ? { cart: data.cart } : {}),
    ...(withVariant ? { productVariant: data.productVariant } : {}),
  } as CartItemsDTO<WithCart, WithVariant>;
}
