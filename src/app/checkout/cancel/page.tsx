"use client";

import { useFinishOrderToCart } from "@/hooks/mutations/use-finish-order-to-cart";

import CheckoutDialog from "../components/checkout-dialog";

const CheckoutCancelPage = () => {
  const { error: errorInFinishOrder } = useFinishOrderToCart();

  return (
    <CheckoutDialog
      imageUrl={"/illustration-order-fail.svg"}
      imageAlt={"Fail"}
      dialogTitle={"Pedido falhou!"}
      dialogDescription={`Seu pedido não pode ser efetuado. ${errorInFinishOrder ? `${errorInFinishOrder.message}.` : ""}`}
    />
  );
};

export default CheckoutCancelPage;
