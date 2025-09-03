import "server-only";

import { db } from "@/db";
import { cartItemTable } from "@/db/schema";

import { mountWhereClause, WhereCondition } from "../mount-where-clause";
import { CartItemsDTO } from "./cart-items-dto";
import { mapToCartItemDTO } from "./map-to-cart-item-dto";

type CartItemColumns = typeof cartItemTable._.columns;

interface GetOneCartItemProps<
  WithCart extends boolean,
  WithVariant extends boolean,
> {
  where: Array<WhereCondition<CartItemColumns>>;
  withCart?: WithCart;
  withVariant?: WithVariant;
}

export async function getOneCartItem<
  WithCart extends boolean,
  WithVariant extends boolean,
>({
  where,
  withCart,
  withVariant,
}: GetOneCartItemProps<WithCart, WithVariant>): Promise<
  CartItemsDTO<WithCart, WithVariant> | undefined
> {
  const whereClause = mountWhereClause({
    table: cartItemTable,
    whereList: where,
  });

  const cartItem = await db.query.cartItemTable.findFirst({
    ...(whereClause && { where: whereClause }),
    with: {
        ...(withCart && {cart: true}),
        ...(withVariant && {productVariant: true}),
    }
  });

  if (!cartItem) {
    return undefined;
  }

  return mapToCartItemDTO(cartItem, withCart, withVariant);
}
