import { getOneDirectBuy } from "@/app/data/direct-buy/get-one-direct-buy";

import Addresses from "../../components/addresses";
import ButtonGoToPayment from "../../components/button-go-to-payment";
import CartSummary from "../../components/cart-summary";

interface DirectBuyPageProps {
  params: Promise<{ directBuyId: string }>;
}

const DirectBuyPage = async ({ params }: DirectBuyPageProps) => {
  const { directBuyId } = await params;
  const directBuy = await getOneDirectBuy({
    withVariant: true,
    withProduct: true,
    where: [{ field: "ID", value: directBuyId }],
  });

  if (!directBuy) throw new Error("Direct Buy Pretension is not found");

  return (
    <div className="px-5 space-y-4">
      <Addresses />
      <CartSummary
        typeDataBase="to-direct"
        directBuyId={directBuy.id}
        directBuyData={directBuy}
      >
        <ButtonGoToPayment
          path={`/cart/direct-buy/${directBuyId}/confirmation`}
          typeDataBase="to-direct"
          directBuyId={directBuy.id}
        />
      </CartSummary>
    </div>
  );
};

export default DirectBuyPage;
