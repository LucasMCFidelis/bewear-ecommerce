"use client";

import { ShoppingBagIcon } from "lucide-react";
import Link from "next/link";

import { formatCentsToBRL } from "@/helpers/money";
import { useCart } from "@/hooks/queries/use-cart";
import { useGlobalStates } from "@/hooks/states/use-global-states";

import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
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
  const [{ isCartOpen }, setGlobalState] = useGlobalStates();
  const { data: cart, isPending: cartIsLoading } = useCart();

  return (
    <Sheet
      open={isCartOpen}
      onOpenChange={(value) => setGlobalState({ isCartOpen: value })}
    >
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

        <div className="flex h-full max-h-full flex-col overflow-hidden">
          <ScrollArea className="h-full">
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
          </ScrollArea>
        </div>

        <SheetFooter className="gap-6">
          {cart?.items && cart?.items.length > 0 ? (
            <>
              <div className="flex justify-between text-sm ">
                <p className="font-semibold">Subtotal</p>
                <p className="text-muted-foreground font-medium">
                  {formatCentsToBRL(cart?.totalPriceInCents || 0)}
                </p>
              </div>
              <Button size={"lg"} className="rounded-full" asChild>
                <Link href={"/cart/identification"}>Finalizar a compra</Link>
              </Button>
            </>
          ) : (
            <>
              <p className="font-semibold text-sm">
                Sua sacola ainda está vazia, adicione algum produto para
                realizar um pedido
              </p>
            </>
          )}
          <Button
            variant={"link"}
            className="text-secondary-foreground"
            onClick={() => setGlobalState({ isCartOpen: false })}
          >
            Continuar comprando
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
