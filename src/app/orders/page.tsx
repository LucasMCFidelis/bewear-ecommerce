import { redirect } from "next/navigation";

import { getManyUserOrders } from "../data/orders/get-many-user-orders";
import { verifyUser } from "../data/user/verify-user";
import OrdersList from "./components/orders-list";

const OrdersPage = async () => {
  const user = await verifyUser();
  if (!user.id) redirect("/");

  const orders = await getManyUserOrders({
    userId: user.id,
    withItems: true,
    withVariant: true,
    withProduct: true,
    withShipping: true,
    where: [{ field: "USER_ID", value: user.id }],
    orderBy: [{ field: "CREATED_AT", type: "desc" }],
  });

  return (
    <div className="px-5 space-y-4">
      <h2 className="font-semibold md:text-lg">Meus pedidos</h2>
      <OrdersList initialOrders={orders} />
    </div>
  );
};

export default OrdersPage;
