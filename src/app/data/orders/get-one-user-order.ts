import "server-only";

import { db } from "@/db";
import { orderTable } from "@/db/schema";

import { OrderFields } from "../columns";
import { mountWhereClause, WhereCondition } from "../mount-where-clause";
import { mapToOrderDTO } from "./map-to-order-dto";
import { OrderDTO } from "./order-dto";

type OrdersColumns = typeof OrderFields;

interface GetOneUserOrderProps<
  WithItems extends boolean,
  WithVariant extends boolean,
  WithProduct extends boolean,
  WithShipping extends boolean,
> {
  userId: string;
  withItems?: WithItems;
  withVariant?: WithVariant;
  withProduct?: WithProduct;
  withShipping?: WithShipping;
  where: Array<WhereCondition<OrdersColumns>>;
}

export async function getOneUserOrder<
  WithItems extends boolean,
  WithVariant extends boolean,
  WithProduct extends boolean,
  WithShipping extends boolean,
>({
  userId,
  withItems,
  withVariant,
  withProduct,
  withShipping,
  where,
}: GetOneUserOrderProps<
  WithItems,
  WithVariant,
  WithProduct,
  WithShipping
>): Promise<OrderDTO | undefined> {
  const whereClause = mountWhereClause({
    table: orderTable,
    tableFields: OrderFields,
    whereList: where,
  });

  const order = await db.query.orderTable.findFirst({
    ...(whereClause && { where: whereClause }),
    with: {
      ...(withItems && {
        items: {
          with: {
            ...(withVariant && {
              productVariant: {
                with: {
                  ...(withProduct && { product: true }),
                },
              },
            }),
          },
        },
      }),
      ...(withShipping && { shippingAddress: true }),
    },
  });

  if (!order) throw new Error("Order not found");

  return mapToOrderDTO({
    userId,
    data: order,
    options: { withItems, withVariant, withProduct, withShipping },
  });
}
