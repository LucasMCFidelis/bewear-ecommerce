import "server-only";

import { db } from "@/db";
import { productTable } from "@/db/schema";

import { ProductFields } from "../columns";
import { mountOrderByClause, OrderByCondition } from "../mount-order-by-clause";
import { mountWhereClause, WhereCondition } from "../mount-where-clause";
import { ProductDTO } from "./product-dto";

type ProductColumns = typeof ProductFields;

interface GetProductsProps<
  WithVariant extends boolean,
  WithCategory extends boolean,
> {
  withProductVariants: WithVariant;
  withCategory?: WithCategory;
  orderBy?: Array<OrderByCondition<ProductColumns>>;
  where?: Array<WhereCondition<ProductColumns>>;
}

export async function getProducts<
  WithVariant extends boolean,
  WithCategory extends boolean,
>({
  withProductVariants,
  withCategory,
  orderBy,
  where,
}: GetProductsProps<WithVariant, WithCategory>): Promise<
  Array<ProductDTO<WithVariant, WithCategory>>
> {
  const whereClause = where
    ? mountWhereClause({
        table: productTable,
        tableFields: ProductFields,
        whereList: where,
      })
    : undefined;
  const orderByClause = orderBy
    ? mountOrderByClause({
        table: productTable,
        tableFields: ProductFields,
        orderByList: orderBy,
      })
    : undefined;

  const products = await db.query.productTable.findMany({
    ...(whereClause && { where: whereClause }),
    ...(orderByClause && { orderBy: orderByClause }),
    with: {
      ...(withProductVariants && { variants: true }),
      ...(withCategory && { category: true }),
    },
  });

  return products;
}
