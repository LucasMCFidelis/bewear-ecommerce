"use server";

import { getManyUserOrders } from "@/app/data/orders/get-many-user-orders";
import { verifyUser } from "@/app/data/user/verify-user";

export const getUserOrders = async () => {
  const user = await verifyUser();

  const orders = await getManyUserOrders({
    userId: user.id,
    withItems: true,
    withVariant: true,
    withProduct: true,
    withShipping: true,
    where: [{ field: "USER_ID", value: user.id }],
    orderBy: [{ field: "CREATED_AT", type: "desc" }],
  });

  return orders;
};
