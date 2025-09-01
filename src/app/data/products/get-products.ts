import "server-only";

import { and, AnyColumn, asc, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { productTable } from "@/db/schema";

import { ProductDTO } from "./product-dto";

type ProductColumnKeys = keyof typeof productTable;

interface GetProductsProps<WithVariant extends boolean> {
  withProductVariants: WithVariant;
  orderBy?: Array<{
    field: ProductColumnKeys;
    type: "asc" | "desc";
  }>;
  where?: Array<{
    field: ProductColumnKeys;
    value: string | number | Date;
  }>;
}

export async function getProducts<WithVariant extends boolean>({
  withProductVariants,
  orderBy,
  where,
}: GetProductsProps<WithVariant>): Promise<Array<ProductDTO<WithVariant>>> {
  const whereClause =
    where && where.length > 0
      ? and(
          ...where.map((condition) =>
            eq(productTable[condition.field] as AnyColumn, condition.value)
          )
        )
      : undefined;

  const products = await db.query.productTable.findMany({
    ...(whereClause && { where: whereClause }),
    ...(orderBy &&
      orderBy?.length > 0 && {
        orderBy: orderBy.map((item) =>
          item.type === "asc"
            ? asc(productTable[item.field] as AnyColumn)
            : desc(productTable[item.field] as AnyColumn)
        ),
      }),
    with: {
      ...(withProductVariants && { variants: true }),
    },
  });

  return products;
}
