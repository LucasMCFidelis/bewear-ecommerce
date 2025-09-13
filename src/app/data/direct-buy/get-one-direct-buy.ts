import "server-only";

import { db } from "@/db";
import { directBuyPretensionTable } from "@/db/schema";

import { DirectBuyPretensionFields } from "../columns";
import { mountWhereClause, WhereCondition } from "../mount-where-clause";
import { DirectBuyDTO } from "./direct-buy-dto";

type DirectBuyColumns = typeof DirectBuyPretensionFields;

interface GetOneDirectBuyProps<
  WithVariant extends boolean,
  WithProduct extends boolean,
> {
  withVariant: WithVariant;
  withProduct: WithProduct;
  where: Array<WhereCondition<DirectBuyColumns>>;
}

export async function getOneDirectBuy<
  WithProduct extends boolean,
  WithVariant extends boolean,
>({
  withVariant,
  withProduct,
  where,
}: GetOneDirectBuyProps<WithProduct, WithVariant>): Promise<
  DirectBuyDTO<WithVariant, WithProduct> | undefined
> {
  const whereClause = mountWhereClause({
    table: directBuyPretensionTable,
    tableFields: DirectBuyPretensionFields,
    whereList: where,
  });

  const directBuy = await db.query.directBuyPretensionTable.findFirst({
    ...(whereClause && { where: whereClause }),
    ...(withVariant && {
      with: {
        ...(withProduct
          ? {
              productVariant: {
                with: { product: true },
              },
            }
          : { productVariant: true }),
      },
    }),
  });

  return directBuy;
}
