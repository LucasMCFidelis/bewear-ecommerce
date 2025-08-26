"use client"

import { useFinishOrder } from "@/hooks/mutations/use-finish-order";

import CheckoutDialog from "../components/checkout-dialog";

const CheckoutCancelPage = () => {
  const { error: errorInFinishOrder } = useFinishOrder();

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
