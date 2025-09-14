import { productTable, productVariantTable } from "@/db/schema";

import { ProductVariantDTO } from "./product-variant-dto";

interface MapToProductVariantDTOProps<
  WithProduct extends boolean,
  WithVariants extends boolean,
> {
  data: typeof productVariantTable.$inferSelect & {
    product?: typeof productTable.$inferSelect & {
      variants?: Array<typeof productVariantTable.$inferSelect>;
    };
  };
  options: {
    withProduct?: WithProduct;
    withVariants?: WithVariants;
  };
}

export function mapToProductVariantDTO<
  WithProduct extends boolean,
  WithVariants extends boolean,
>({
  data,
  options,
}: MapToProductVariantDTOProps<WithProduct, WithVariants>): ProductVariantDTO<
  WithProduct,
  WithVariants
> {
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

  if (options.withProduct && data.product) {
    return {
      ...base,
      product: {
        ...data.product,
        variants: options.withVariants
          ? (data.product.variants?.map((variant) =>
              mapToProductVariantDTO({
                data: variant,
                options: { withProduct: false, withVariants: false },
              })
            ) ?? [])
          : [],
      },
    } as ProductVariantDTO<WithProduct, WithVariants>;
  }

  return {
    ...base,
    product: data.product
      ? {
          ...data.product,
          variants: [],
        }
      : undefined,
  } as ProductVariantDTO<WithProduct, WithVariants>;
}
