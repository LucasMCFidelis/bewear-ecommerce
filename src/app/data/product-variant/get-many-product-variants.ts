import "server-only";

import { db } from "@/db";
import { productVariantTable } from "@/db/schema";

import { ProductVariantFields } from "../columns";
import { mountOrderByClause, OrderByCondition } from "../mount-order-by-clause";
import { mountWhereClause, WhereCondition } from "../mount-where-clause";
import { mapToProductVariantDTO } from "./map-to-product-variant-dto";
import { ProductVariantDTO } from "./product-variant-dto";

type ProductVariantColumns = typeof ProductVariantFields;

interface GetManyProductVariantProps<
  WithProduct extends boolean,
  WithVariants extends boolean,
> {
  where: Array<WhereCondition<ProductVariantColumns>>;
  orderBy?: Array<OrderByCondition<ProductVariantColumns>>;
  withProduct: WithProduct;
  withVariants: WithVariants;
}

export async function getManyProductVariant<
  WithProduct extends boolean,
  WithVariants extends boolean,
>({
  where,
  orderBy,
  withProduct,
  withVariants,
}: GetManyProductVariantProps<WithProduct, WithVariants>): Promise<
  Array<ProductVariantDTO<WithProduct, WithVariants>>
> {
  const whereClause = mountWhereClause({
    table: productVariantTable,
    tableFields: ProductVariantFields,
    whereList: where,
  });
  const orderByClause = orderBy
    ? mountOrderByClause({
        table: productVariantTable,
        tableFields: ProductVariantFields,
        orderByList: orderBy,
      })
    : undefined;

  const productVariantsRaw = await db.query.productVariantTable.findMany({
    ...(orderByClause && { orderBy: orderByClause }),
    ...(whereClause && { where: whereClause }),
    ...(withProduct && {
      with: {
        ...(withVariants
          ? { product: { with: { variants: true } } }
          : { product: true }),
      },
    }),
  });

  if (!productVariantsRaw) {
    return [];
  }

  return productVariantsRaw.map((productVariant) =>
    mapToProductVariantDTO({
      data: productVariant,
      options: { withProduct, withVariants },
    })
  );
}
