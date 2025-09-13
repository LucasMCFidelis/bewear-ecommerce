
import { getOneDirectBuy } from "@/app/data/direct-buy/get-one-direct-buy";
import { getManyShippingAddresses } from "@/app/data/shippingAddress/get-many-shipping-addresses";
import { verifyUser } from "@/app/data/user/verify-user";

import ShippingAddressProvider from "../../address-context";
import Addresses from "../../components/addresses";
import ButtonGoToPayment from "../../components/button-go-to-payment";
import CartSummary from "../../components/cart-summary";

interface DirectBuyPageProps {
  params: Promise<{ directBuyId: string }>;
}

const DirectBuyPage = async ({ params }: DirectBuyPageProps) => {
  const user = await verifyUser();

  const shippingAddresses = await getManyShippingAddresses({
    userId: user.id,
  });

  const { directBuyId } = await params;

  const directBuy = await getOneDirectBuy({
    withVariant: true,
    withProduct: true,
    where: [{ field: "ID", value: directBuyId }],
  });

  if (!directBuy) throw new Error("Direct Buy Pretension is not found");

  const buySubtotalInCents = directBuy?.priceInCents * directBuy?.quantity;
  return (
    <ShippingAddressProvider defaultShippingAddressId={shippingAddresses[0].id}>
      <div className="px-5 space-y-4">
        <Addresses shippingAddresses={shippingAddresses} />
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
          <ButtonGoToPayment path={`/cart/direct-buy/${directBuyId}/confirmation`} typeDataBase="to-direct" directBuyId={directBuy.id} />
        </CartSummary>
      </div>
    </ShippingAddressProvider>
  );
};

export default DirectBuyPage;
