"use client";

import { loadStripe } from "@stripe/stripe-js";

import { createCheckoutSessionToCart } from "@/actions/create-checkout-session";
import LoaderSpin from "@/components/common/loader-spin";
import { Button } from "@/components/ui/button";
import { useFinishOrderToCart } from "@/hooks/mutations/use-finish-order-to-cart";

const FinishOrderButtonToCart = () => {
  const finishOrderMutation = useFinishOrderToCart();

  const handleFinishOrder = async () => {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      throw new Error("Stripe publishable key is not set");
    }
    const { orderId } = await finishOrderMutation.mutateAsync();
    const checkoutSession = await createCheckoutSessionToCart({ orderId });
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
        disabled={finishOrderMutation.isPending}
      >
        {finishOrderMutation.isPending ? (
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

export default FinishOrderButtonToCart;
