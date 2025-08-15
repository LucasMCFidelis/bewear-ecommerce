import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Addresses from "@/app/cart/identification/components/addresses";
import { db } from "@/db";
import { cartTable, shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

const IdentificationPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user.id) redirect("/");

  const cart = await db.query.cartTable.findFirst({
    where: eq(cartTable.userId, session.user.id),
    with: { items: true },
  });
  if (!cart || cart.items.length === 0) redirect("/");

  const shippingAddresses = await db.query.shippingAddressTable.findMany({
    where: eq(shippingAddressTable.userId, session.user.id),
  });

  return (
    <div className="px-5">
      <Addresses shippingAddresses={shippingAddresses} />
    </div>
  );
};

export default IdentificationPage;
