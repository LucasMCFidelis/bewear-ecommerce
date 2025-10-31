"use client"

import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatAddress } from "@/helpers/address";

import { useCartContext } from "../cart-context";
import CartSummary from "../components/cart-summary";
import FinishOrderButtonToCart from "./components/finish-order-button-to-cart";

const ConfirmationPage = () => {
  const { selectedShippingAddress, shippingAddresses, productsInCart } =
    useCartContext();

  if (productsInCart.length === 0) redirect("/");
  const shippingAddress = shippingAddresses.find(
    (address) => address.id === selectedShippingAddress
  );
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
                  address: shippingAddress ? shippingAddress : null,
                })}
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
      <CartSummary typeDataBase="to-cart">
        <FinishOrderButtonToCart />
      </CartSummary>
    </div>
  );
};

export default ConfirmationPage;
