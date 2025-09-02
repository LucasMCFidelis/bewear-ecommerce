import { productTable, productVariantTable } from "@/db/schema";

import { ProductVariantDTO } from "./product-variant-dto";

export function mapToProductVariantDTO<WithProduct extends boolean = false, WithVariants extends boolean = false>(
  data: typeof productVariantTable.$inferSelect & {
    product?: typeof productTable.$inferSelect  & {variants: Array<typeof productVariantTable.$inferSelect>};
  },
  withProduct?: WithProduct
): ProductVariantDTO<WithProduct, WithVariants> {
  const base = {
    id: data.id,
    name: data.name,
    createdAt: new Date(data.createdAt),
    slug: data.slug,
    productId: data.productId,
    color: data.color,
    priceInCents: data.priceInCents,
    imageUrl: data.imageUrl,
    quantityInStock: data.quantityInStock,
  };
  if (withProduct) {
    return {
      ...base,
      product: data.product,
    } as ProductVariantDTO<WithProduct,WithVariants>;
  } else {
    return {
      ...base,
      product: data.product ? data.product : undefined,
    } as ProductVariantDTO<WithProduct, WithVariants>;
  }
}
