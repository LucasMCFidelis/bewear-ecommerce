import "server-only";

import { db } from "@/db";

import { CartItemsDTO } from "../cart-item/cart-items-dto";
import { ProductVariantDTO } from "../product-variant/product-variant-dto";
import { ProductDTO } from "../products/product-dto";
import { verifyUser } from "../user/verify-user";
import { CartDTO } from "./cart-dto";

interface GetCartDataProps<
  WithShipping extends boolean,
  WithItems extends boolean,
  WithVariant extends boolean,
  WithProduct extends boolean,
> {
  userId: string;
  withShippingAddress?: WithShipping;
  withItems?: WithItems;
  withProductVariant?: WithVariant;
  withProduct?: WithProduct;
}

function hasProductVariant(
  item: CartItemsDTO
): item is CartItemsDTO & { productVariant: ProductVariantDTO } {
  return "productVariant" in item && item.productVariant != null;
}

function hasProduct(item: CartItemsDTO): item is CartItemsDTO & {
  productVariant: ProductVariantDTO & { product: ProductDTO };
} {
  return hasProductVariant(item) && item.productVariant.product != null;
}

export async function getCartData<
  WithShipping extends boolean,
  WithItems extends boolean,
  WithVariant extends boolean,
  WithProduct extends boolean,
>({
  userId,
  withItems,
  withProduct,
  withProductVariant,
  withShippingAddress,
}: GetCartDataProps<
  WithShipping,
  WithItems,
  WithVariant,
  WithProduct
>): Promise<
  CartDTO<WithShipping, WithItems, WithVariant, WithProduct> | undefined
> {
  await verifyUser();

  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, userId),
    with: {
      ...(withShippingAddress && { shippingAddress: true }),
      ...(withItems && {
        items: {
          with: {
            ...(withProductVariant && {
              productVariant: {
                with: {
                  ...(withProduct && { product: true }),
                },
              },
            }),
          },
        },
      }),
    },
  });

  if (!cart) return;

  const cartTotalInCents =
    cart?.items?.reduce(
      (acc, item) =>
        "productVariant" in item && item.productVariant
          ? acc + item.productVariant.priceInCents * item.quantity
          : acc,
      0
    ) ?? 0;

  const dto: Partial<CartDTO<boolean, boolean, boolean, boolean>> = {
    userId: cart.userId,
    id: cart.id,
    createdAt: cart.createdAt,
    cartTotalInCents,
    shippingAddressId: cart.shippingAddressId ?? null,
  };

  if (withShippingAddress) {
    dto.shippingAddress = cart.shippingAddress!;
  }

  if (withItems) {
    dto.items = cart?.items?.map((item) => {
      const dtoItem: CartItemsDTO = { ...item };

      if (withProductVariant && hasProductVariant(item)) {
        dtoItem.productVariant = item.productVariant;

        if (withProduct && hasProduct(item)) {
          dtoItem.productVariant.product = item.productVariant.product;
        }
      }

      return dtoItem;
    });
  }

  return dto as CartDTO<WithShipping, WithItems, WithVariant, WithProduct>;
}
