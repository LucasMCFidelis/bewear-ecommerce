import { useQuery } from "@tanstack/react-query";
import { ShoppingBagIcon } from "lucide-react";

import { getCart } from "@/actions/get-cart";
import { formatCentsToBRL } from "@/helpers/money";

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
  const { data: cart, isPending: cartIsLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(),
  });

  return (
    <Sheet>
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
              productName={item.productVariant.product.name}
              productVariantName={item.productVariant.name}
              productVariantImageUrl={item.productVariant.imageUrl}
              productVariantPriceInCents={item.productVariant.priceInCents}
              productVariantQuantityInStock={
                item.productVariant.quantityInStock
              }
              quantityInitial={item.quantity}
            />
          ))}
        </div>
        <SheetFooter className="gap-6">
          <div className="flex justify-between text-sm ">
            <p className="font-semibold">Subtotal</p>
            <p className="text-muted-foreground font-medium">
              {formatCentsToBRL(1000000)}
            </p>
          </div>
          <Button size={"lg"} className="rounded-full">
            Finalizar a compra
          </Button>
          <Button variant={"link"} className="text-secondary">Continuar comprando</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
