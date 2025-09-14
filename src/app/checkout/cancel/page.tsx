"use client";

import { useFinishOrderToCart } from "@/hooks/mutations/use-finish-order-to-cart";

import CheckoutDialog from "../components/checkout-dialog";

const CheckoutCancelPage = () => {
  const { error: errorInFinishOrder } = useFinishOrderToCart();

  return (
    <CheckoutDialog
      imageUrl={"/illustration-order-fail.svg"}
      imageAlt={"Fail"}
      dialogTitle={"Checkout falhou!"}
      dialogDescription={`O checkout do seu pedido não foi finalizado. ${errorInFinishOrder ? `${errorInFinishOrder.message}.` : ""}`}
    />
  );
};

export default CheckoutCancelPage;
