"use client";

import { loadStripe } from "@stripe/stripe-js";

import { createCheckoutSessionToDirect } from "@/actions/create-checkout-session";
import LoaderSpin from "@/components/common/loader-spin";
import { Button } from "@/components/ui/button";
import { useFinishOrderToDirect } from "@/hooks/mutations/use-finish-order-to-direct";

const FinishOrderButtonToDirect = ({
  directBuyId,
  shippingAddressId,
}: {
  directBuyId: string;
  shippingAddressId: string;
}) => {
  const finishOrderToDirectMutation = useFinishOrderToDirect(
    directBuyId,
    shippingAddressId
  );

  const handleFinishOrder = async () => {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      throw new Error("Stripe publishable key is not set");
    }
    const { orderId } = await finishOrderToDirectMutation.mutateAsync();
    const checkoutSession = await createCheckoutSessionToDirect({ orderId });
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    );
    if (!stripe) {
      throw new Error("Failed to load stripe");
    }
    await stripe.redirectToCheckout({
      sessionId: checkoutSession.id,
    });
  };

  return (
    <>
      <Button
        className="w-full rounded-full"
        size="lg"
        onClick={handleFinishOrder}
        disabled={finishOrderToDirectMutation.isPending}
      >
        {finishOrderToDirectMutation.isPending ? (
          <>
            Finalizando sua compra
            <LoaderSpin />
          </>
        ) : (
          <>Finalizar compra</>
        )}
      </Button>
    </>
  );
};

export default FinishOrderButtonToDirect;
