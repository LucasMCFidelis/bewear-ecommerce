
import CartSummary from "@/app/cart/components/cart-summary";
import { getCartData } from "@/app/data/cart/get-cart-data";
import { getOneDirectBuy } from "@/app/data/direct-buy/get-one-direct-buy";
import { verifyUser } from "@/app/data/user/verify-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatAddress } from "@/helpers/address";

import FinishOrderButtonToDirect from "./components/finish-order-button-to-direct";

interface ConfirmationDirectBuyPageProps {
  params: Promise<{ directBuyId: string }>;
}

const ConfirmationDirectBuyPage = async ({
  params,
}: ConfirmationDirectBuyPageProps) => {
  const user = await verifyUser();
  const { directBuyId } = await params;

  const directBuy = await getOneDirectBuy({
    withVariant: true,
    withProduct: true,
    where: [{ field: "ID", value: directBuyId }],
  });

  const cart = await getCartData({
    userId: user.id,
    withShippingAddress: true,
  });

  if (!cart || !cart.shippingAddress) throw new Error("Cart is not found");
  if (!directBuy) throw new Error("Direct Buy Pretension is not found");

  const buySubtotalInCents = directBuy?.priceInCents * directBuy?.quantity;

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
        typeDataBase="to-direct"
        directBuyId={directBuy.id}
        subtotalInCents={buySubtotalInCents}
        products={[
          {
            id: directBuy.productVariant!.id,
            name: directBuy.productVariant!.product!.name,
            variantName: directBuy.productVariant!.name,
            quantity: directBuy.quantity,
            widthInCentimeters:
              directBuy.productVariant!.product!.widthInCentimeters,
            heightInCentimeters:
              directBuy.productVariant!.product!.heightInCentimeters,
            lengthInCentimeters:
              directBuy.productVariant!.product!.lengthInCentimeters,
            weightInGrams: directBuy.productVariant!.product!.weightInGrams,
            priceInCents: directBuy.productVariant!.priceInCents,
            imageUrl: directBuy.productVariant!.imageUrl,
          },
        ]}
      >
        <FinishOrderButtonToDirect
          directBuyId={directBuyId}
          shippingAddressId={cart?.shippingAddress?.id}
        />
      </CartSummary>
    </div>
  );
};

export default ConfirmationDirectBuyPage;
