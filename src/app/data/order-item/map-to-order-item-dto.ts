import { orderItemTable, productTable, productVariantTable } from "@/db/schema";

import { mapToProductVariantDTO } from "../product-variant/map-to-product-variant-dto";
import { OrderItemDTO } from "./order-item-dto";

interface MapToOrderItemDTOProps<
  WithVariant extends boolean = false,
  WithProduct extends boolean = false,
> {
  data: typeof orderItemTable.$inferSelect & {
    productVariant?: typeof productVariantTable.$inferSelect & {
      product?: typeof productTable.$inferSelect;
    };
  };
  options: {
    withVariant?: WithVariant;
    withProduct?: WithProduct;
  };
}

export function mapToOrderItemDTO<
  WithVariant extends boolean = false,
  WithProduct extends boolean = false,
>({
  data,
  options,
}: MapToOrderItemDTOProps<WithVariant, WithProduct>): OrderItemDTO<
  WithVariant,
  WithProduct
> {
  const base = {
    id: data.id,
    orderId: data.orderId,
    createdAt: new Date(data.createdAt),
    priceInCents: data.priceInCents,
    productVariantId: data.productVariantId,
    quantity: data.quantity,
  };

  const productVariant =
    options.withVariant && data.productVariant
      ? mapToProductVariantDTO({data: data.productVariant, options: {withProduct: options.withProduct}})
      : data.productVariant
        ? mapToProductVariantDTO({data: data.productVariant, options: {withProduct: options.withProduct}})
        : undefined;

  return {
    ...base,
    ...(options.withVariant
      ? { productVariant }
      : { productVariant: undefined }),
  } as OrderItemDTO<WithVariant, WithProduct>;
}
