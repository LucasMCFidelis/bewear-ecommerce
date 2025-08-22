import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { orderTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import OrdersList from "./components/orders-list";

const OrdersPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user.id) redirect("/");

  const orders = await db.query.orderTable.findMany({
    orderBy: [desc(orderTable.createdAt)],
    where: eq(orderTable.userId, session.user.id),
   with: {
      items: { with: { productVariant: { with: { product: true } } } },
      shippingAddress: true,
    },
  });

  return (
    <div className="px-5 space-y-4">
      <h2 className="font-semibold text-lg">Meus pedidos</h2>
      <OrdersList initialOrders={orders} />
    </div>
  );
};

export default OrdersPage;
