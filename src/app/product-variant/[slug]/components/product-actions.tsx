"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

import { ProductVariantDTO } from "@/app/data/product-variant/product-variant-dto";
import { Button } from "@/components/ui/button";
import { useCreateDirectBuyPretension } from "@/hooks/mutations/use-create-direct-buy-pretension";
import { authClient } from "@/lib/auth-client";

import AddToCartButton from "./add-to-cart-button";

interface ProductActionsProps {
  productVariant: ProductVariantDTO;
}

const ProductActions = ({ productVariant }: ProductActionsProps) => {
  const { data: session } = authClient.useSession();
  if (!session?.user.id) redirect("/");

  const [{ slug, quantity }, setProductStates] = useQueryStates({
    slug: parseAsString.withDefault(productVariant.slug),
    quantity: parseAsInteger.withDefault(1),
  });

  const createDirectBuyPretensionMutation = useCreateDirectBuyPretension();
  const quantityMax = productVariant.quantityInStock;

  console.log("slug", slug);

  const handleDecrement = () => {
    const newQuantity = quantity > 1 ? quantity - 1 : quantity;
    setProductStates({ quantity: newQuantity });
  };

  const handleIncrement = () => {
    const newQuantity = quantity < quantityMax ? quantity + 1 : quantity;
    setProductStates({ quantity: newQuantity });
  };

  const handleDirectBuy = async () => {
    const directBuy = await createDirectBuyPretensionMutation.mutateAsync({
      productVariantId: productVariant.id,
      priceInCents: productVariant.priceInCents,
      userId: session?.user.id,
      quantity,
    });

    redirect(`/cart/direct-buy/${directBuy.id}`)
  };

  return (
    <>
      <div className="space-y-4">
        <h3 className="font-medium">Quantidade</h3>
        <div className="flex w-[100px] items-center justify-between rounded-lg border">
          <Button size="icon" variant="ghost" onClick={handleDecrement}>
            <MinusIcon />
          </Button>
          <p>{quantity}</p>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleIncrement}
            disabled={quantity === quantityMax}
          >
            <PlusIcon />
          </Button>
        </div>
      </div>

      <div className="space-y-4 flex flex-col">
        <AddToCartButton
          productVariantId={productVariant.id}
          quantity={quantity}
          disabled={quantity > productVariant.quantityInStock}
        />
        <Button
          className="rounded-full"
          size={"lg"}
          disabled={createDirectBuyPretensionMutation.isPending}
          onClick={handleDirectBuy}
        >
          Comprar Agora
        </Button>
      </div>
    </>
  );
};

export default ProductActions;
