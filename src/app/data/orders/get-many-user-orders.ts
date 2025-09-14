import "server-only";

import { db } from "@/db";
import { orderTable } from "@/db/schema";

import { OrderFields } from "../columns";
import { mountOrderByClause, OrderByCondition } from "../mount-order-by-clause";
import { mountWhereClause, WhereCondition } from "../mount-where-clause";
import { mapToOrderDTO } from "./map-to-order-dto";
import { OrderDTO } from "./order-dto";

type OrdersColumns = typeof OrderFields;

interface GetManyUserOrdersProps<
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
  orderBy?: Array<OrderByCondition<OrdersColumns>>;
  where?: Array<WhereCondition<OrdersColumns>>;
}

export async function getManyUserOrders<
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
  orderBy,
}: GetManyUserOrdersProps<
  WithItems,
  WithVariant,
  WithProduct,
  WithShipping
>): Promise<Array<OrderDTO> | undefined> {
  const whereClause = where
    ? mountWhereClause({
        table: orderTable,
        tableFields: OrderFields,
        whereList: where,
      })
    : undefined;
  const orderByClause = orderBy
    ? mountOrderByClause({
        table: orderTable,
        tableFields: OrderFields,
        orderByList: orderBy,
      })
    : undefined;

  const orders = await db.query.orderTable.findMany({
    ...(whereClause && { where: whereClause }),
    ...(orderByClause && { orderBy: orderByClause }),
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

  return Promise.all(
    orders.map((order) =>
      mapToOrderDTO({
        userId,
        data: order,
        options: { withItems, withVariant, withProduct, withShipping },
      })
    )
  );
}
