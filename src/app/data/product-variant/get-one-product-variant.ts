import "server-only";

import { db } from "@/db";
import { productVariantTable } from "@/db/schema";

import { ProductVariantFields } from "../columns";
import { mountWhereClause, WhereCondition } from "../mount-where-clause";
import { mapToProductVariantDTO } from "./map-to-product-variant-dto";
import { ProductVariantDTO } from "./product-variant-dto";

type ProductVariantColumns = typeof ProductVariantFields;

interface GetOneProductVariantProps<
  WithProduct extends boolean,
  WithVariants extends boolean,
> {
  where: Array<WhereCondition<ProductVariantColumns>>;
  withProduct?: WithProduct;
  withVariants?: WithVariants;
}

export async function getOneProductVariant<
  WithProduct extends boolean,
  WithVariants extends boolean,
>({
  where,
  withProduct,
  withVariants,
}: GetOneProductVariantProps<WithProduct, WithVariants>): Promise<
  ProductVariantDTO<WithProduct, WithVariants> | undefined
> {
  const whereClause = mountWhereClause({
    table: productVariantTable,
    tableFields: ProductVariantFields,
    whereList: where,
  });
  const productVariantRaw = await db.query.productVariantTable.findFirst({
    ...(whereClause && { where: whereClause }),
    ...(withProduct && {
      with: {
        ...(withVariants
          ? { product: { with: { variants: true } } }
          : { product: true }),
      },
    }),
  });

  if (!productVariantRaw) {
    return undefined;
  }

  return mapToProductVariantDTO({
    data: productVariantRaw,
    options: { withProduct, withVariants },
  });
}
