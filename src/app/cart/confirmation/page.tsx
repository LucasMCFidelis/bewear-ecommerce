import { redirect } from "next/navigation";

import { getCartData } from "@/app/data/cart/get-cart-data";
import { verifyUser } from "@/app/data/user/verify-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatAddress } from "@/helpers/address";

import CartSummary from "../components/cart-summary";
import FinishOrderButtonToCart from "./components/finish-order-button-to-cart";

const ConfirmationPage = async () => {
  const user = await verifyUser();
  const cart = await getCartData({
    userId: user.id,
    withShippingAddress: true,
    withItems: true,
    withProductVariant: true,
    withProduct: true,
  });
  if (!cart || cart?.items.length === 0) {
    redirect("/");
  }
  const cartTotalInCents = cart.items.reduce(
    (acc, item) =>
      acc +
      (item.productVariant ? item.productVariant.priceInCents : 0) *
        item.quantity,
    0
  );
  if (!cart.shippingAddress) {
    redirect("/cart/identification");
  }
  return (
    <div className="space-y-4 px-5">
      <Card>
        <CardHeader>
          <CardTitle>Identificação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card>
            <CardContent>
              <p className="text-sm">
                {formatAddress({
                  address: cart.shippingAddress ? cart.shippingAddress : null,
                })}
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
      <CartSummary
        typeDataBase="to-cart"
        subtotalInCents={cartTotalInCents}
        products={cart.items.map((item) => ({
          id: item.productVariant!.id,
          name: item.productVariant!.product!.name,
          variantName: item.productVariant!.name,
          quantity: item.quantity,
          widthInCentimeters: item.productVariant!.product!.widthInCentimeters,
          heightInCentimeters:
            item.productVariant!.product!.heightInCentimeters,
          lengthInCentimeters:
            item.productVariant!.product!.lengthInCentimeters,
          weightInGrams: item.productVariant!.product!.weightInGrams,
          priceInCents: item.productVariant!.priceInCents,
          imageUrl: item.productVariant!.imageUrl,
        }))}
      >
        <FinishOrderButtonToCart />
      </CartSummary>
    </div>
  );
};

export default ConfirmationPage;
