import "server-only";

import { db } from "@/db";
import { categoryTable } from "@/db/schema";

import { mountWhereClause, WhereCondition } from "../mount-where-clause";
import { CategoryDTO } from "./category-dto";

type CategoryColumns = typeof categoryTable._.columns;

interface GetOneCategoryProps<
  WithProducts extends boolean,
  WithVariants extends boolean,
> {
  withProducts: WithProducts;
  withVariants: WithVariants;
  where: Array<WhereCondition<CategoryColumns>>;
}

export async function getOneCategory<
  WithProducts extends boolean,
  WithVariants extends boolean,
>({
  withProducts,
  withVariants,
  where,
}: GetOneCategoryProps<WithProducts, WithVariants>): Promise<
  CategoryDTO<WithProducts, WithVariants> | undefined
> {
  const whereClause = mountWhereClause({ table: categoryTable, whereList: where })
    
  const category = await db.query.categoryTable.findFirst({
    ...(whereClause && { where: whereClause }),
    ...(withProducts && {
      with: {
        ...(withVariants
          ? { products: { with: { variants: true } } }
          : { products: true }),
      },
    }),
  });

  return category;
}
