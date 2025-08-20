import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Addresses from "@/app/cart/identification/components/addresses";
import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import ShippingAddressProvider from "../address-context";
import CartSummary from "../components/cart-summary";
import ButtonGoToPayment from "./components/button-go-to-payment";

const IdentificationPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user.id) redirect("/");

  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
    with: {
      shippingAddress: true,
      items: {
        with: {
          productVariant: { with: { product: true } },
        },
      },
    },
  });
  if (!cart || cart.items.length === 0) redirect("/");

  const shippingAddresses = await db.query.shippingAddressTable.findMany({
    where: eq(shippingAddressTable.userId, session.user.id),
  });

  const cartTotalInCents = cart.items.reduce(
    (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
    0
  );

  return (
    <ShippingAddressProvider
      defaultShippingAddressId={cart.shippingAddress?.id}
    >
      <div className="px-5 space-y-4">
        <Addresses shippingAddresses={shippingAddresses} />
        <CartSummary
          subtotalInCents={cartTotalInCents}
          products={cart.items.map((item) => ({
            id: item.productVariant.id,
            name: item.productVariant.product.name,
            variantName: item.productVariant.name,
            quantity: item.quantity,
            widthInCentimeters: item.productVariant.product.widthInCentimeters,
            heightInCentimeters:
              item.productVariant.product.heightInCentimeters,
            lengthInCentimeters:
              item.productVariant.product.lengthInCentimeters,
            weightInGrams: item.productVariant.product.weightInGrams,
            priceInCents: item.productVariant.priceInCents,
            imageUrl: item.productVariant.imageUrl,
          }))}
        >
          <ButtonGoToPayment />
        </CartSummary>
      </div>
    </ShippingAddressProvider>
  );
};

export default IdentificationPage;
