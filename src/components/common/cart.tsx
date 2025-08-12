"use client";

import { ShoppingBagIcon } from "lucide-react";
import { useState } from "react";

import { formatCentsToBRL } from "@/helpers/money";
import { useCart } from "@/hooks/queries/use-cart";

import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import CartItem from "./cart-item";

const Cart = () => {
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const { data: cart, isPending: cartIsLoading } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetTrigger asChild>
        <Button variant={"outline"} size={"icon"}>
          <ShoppingBagIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <div className="flex gap-4 items-center">
            <ShoppingBagIcon />
            <SheetTitle>Sacola</SheetTitle>
          </div>
        </SheetHeader>
        <div className="px-5 space-y-4">
          {cartIsLoading && <div>Carregando...</div>}
          {cart?.items.map((item) => (
            <CartItem
              key={item.id}
              cartItemId={item.id}
              productVariant={item.productVariant}
              quantity={item.quantity}
            />
          ))}
        </div>
        <SheetFooter className="gap-6">
          <div className="flex justify-between text-sm ">
            <p className="font-semibold">Subtotal</p>
            <p className="text-muted-foreground font-medium">
              {formatCentsToBRL(cart?.totalPriceInCents || 0)}
            </p>
          </div>
          <Button size={"lg"} className="rounded-full">
            Finalizar a compra
          </Button>
          <Button
            variant={"link"}
            className="text-secondary-foreground"
            onClick={() => setIsCartOpen(false)}
          >
            Continuar comprando
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
