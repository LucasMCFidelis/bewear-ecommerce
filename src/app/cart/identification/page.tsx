import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Addresses from "@/app/cart/components/addresses";
import { getCartData } from "@/app/data/cart/get-cart-data";
import { getManyShippingAddresses } from "@/app/data/shippingAddress/get-many-shipping-addresses";
import { auth } from "@/lib/auth";

import ShippingAddressProvider from "../address-context";
import ButtonGoToPayment from "../components/button-go-to-payment";
import CartSummary from "../components/cart-summary";

const IdentificationPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user.id) redirect("/");

  const [cart, shippingAddresses] = await Promise.all([
    getCartData({
      userId: session.user.id,
      withShippingAddress: true,
      withItems: true,
      withProductVariant: true,
      withProduct: true,
    }),
    getManyShippingAddresses({
      userId: session.user.id,
    }),
  ]);

  if (!cart || cart.items.length === 0) redirect("/");

  const cartTotalInCents = cart.items.reduce(
    (acc, item) =>
      acc +
      (item.productVariant ? item.productVariant.priceInCents : 0) *
        item.quantity,
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
          products={cart.items.map((item) => {
            if (!item.productVariant || !item.productVariant.product)
              throw new Error("Product or Product Variant not defined ");

            return {
              id: item.productVariant.id,
              name: item.productVariant.product.name,
              variantName: item.productVariant.name,
              quantity: item.quantity,
              widthInCentimeters:
                item.productVariant.product.widthInCentimeters,
              heightInCentimeters:
                item.productVariant.product.heightInCentimeters,
              lengthInCentimeters:
                item.productVariant.product.lengthInCentimeters,
              weightInGrams: item.productVariant.product.weightInGrams,
              priceInCents: item.productVariant.priceInCents,
              imageUrl: item.productVariant.imageUrl,
            };
          })}
        >
          <ButtonGoToPayment path="/cart/confirmation" />
        </CartSummary>
      </div>
    </ShippingAddressProvider>
  );
};

export default IdentificationPage;
