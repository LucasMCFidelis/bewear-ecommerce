"use client";

import { redirect } from "next/navigation";

import Addresses from "@/app/cart/components/addresses";

import { useCartContext } from "../cart-context";
import ButtonGoToPayment from "../components/button-go-to-payment";
import CartSummary from "../components/cart-summary";

const IdentificationPage = () => {
  const { productsInCart } = useCartContext();

  if (productsInCart.length === 0) redirect("/");
  return (
    <div className="px-5 space-y-4">
      <Addresses />
      <CartSummary typeDataBase="to-cart">
        <ButtonGoToPayment typeDataBase="to-cart" path="/cart/confirmation" />
      </CartSummary>
    </div>
  );
};

export default IdentificationPage;
