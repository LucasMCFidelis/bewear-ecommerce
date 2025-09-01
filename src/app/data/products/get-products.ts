import "server-only";

import { db } from "@/db";
import { productTable } from "@/db/schema";

import { mountOrderByClause, OrderByCondition } from "../mount-order-by-clause";
import { mountWhereClause, WhereCondition } from "../mount-where-clause";
import { ProductDTO } from "./product-dto";

type ProductColumns = typeof productTable._.columns;

interface GetProductsProps<WithVariant extends boolean> {
  withProductVariants: WithVariant;
  orderBy?: Array<OrderByCondition<ProductColumns>>;
  where?: Array<WhereCondition<ProductColumns>>;
}

export async function getProducts<WithVariant extends boolean>({
  withProductVariants,
  orderBy,
  where,
}: GetProductsProps<WithVariant>): Promise<Array<ProductDTO<WithVariant>>> {
  const whereClause = where
    ? mountWhereClause({ table: productTable, whereList: where })
    : undefined;
  const orderByClause = orderBy
    ? mountOrderByClause({ table: productTable, orderByList: orderBy })
    : undefined;

  const products = await db.query.productTable.findMany({
    ...(whereClause && { where: whereClause }),
    ...(orderByClause && { orderBy: orderByClause }),
    with: {
      ...(withProductVariants && { variants: true }),
    },
  });

  return products;
}
