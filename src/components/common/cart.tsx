import { useQuery } from "@tanstack/react-query";
import { ShoppingBagIcon } from "lucide-react";
import Image from "next/image";

import { getCart } from "@/actions/get-cart";

import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

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
        <SheetHeader className="flex-row justify-between">
          <div className="flex gap-4 items-center">
            <ShoppingBagIcon />
            <SheetTitle>Sacola</SheetTitle>
          </div>
        </SheetHeader>
        <div className="px-5">
          {cartIsLoading && <div>Carregando...</div>}
          {cart?.items.map((item) => (
            <div key={item.id}>
              <Image
                src={item.productVariant.imageUrl}
                alt={item.productVariant.product.name}
                width={100}
                height={100}
              />
              <div>
                <h3>{item.productVariant.product.name}</h3>
                <p>{item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
