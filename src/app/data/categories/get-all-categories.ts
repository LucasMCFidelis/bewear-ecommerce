import "server-only";

import { db } from "@/db";
import { categoryTable } from "@/db/schema";

import { mountOrderByClause, OrderByCondition } from "../mount-order-by-clause";
import { CategoryDTO } from "./category-dto";

type CategoryColumns = typeof categoryTable._.columns;

interface GetAllCategoriesProps<
  WithProducts extends boolean,
  WithVariants extends boolean,
> {
  withProducts: WithProducts;
  withVariants: WithVariants;
  orderBy?: Array<OrderByCondition<CategoryColumns>>;
}

export async function getAllCategories<
  WithProducts extends boolean,
  WithVariants extends boolean,
>({
  withProducts,
  withVariants,
  orderBy,
}: GetAllCategoriesProps<WithProducts, WithVariants>): Promise<
  Array<CategoryDTO<WithProducts, WithVariants>> | undefined
> {
  const orderByClause = orderBy
    ? mountOrderByClause({ table: categoryTable, orderByList: orderBy })
    : undefined;

  const categories = await db.query.categoryTable.findMany({
    ...(orderByClause && { orderBy: orderByClause }),
    ...(withProducts && {
      with: {
        ...(withVariants
          ? { products: { with: { variants: true } } }
          : { products: true }),
      },
    }),
  });

  return categories;
}
