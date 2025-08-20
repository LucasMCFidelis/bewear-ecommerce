import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { formatAddress } from "@/helpers/address";
import { auth } from "@/lib/auth";

import CartSummary from "../components/cart-summary";

const ConfirmationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user.id) {
    redirect("/");
  }
  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
    with: {
      shippingAddress: true,
      items: {
        with: {
          productVariant: {
            with: {
              product: true,
            },
          },
        },
      },
    },
  });
  if (!cart || cart?.items.length === 0) {
    redirect("/");
  }
  const cartTotalInCents = cart.items.reduce(
    (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
    0
  );
  if (!cart.shippingAddress) {
    redirect("/cart/identification");
  }
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
                {formatAddress({ address: cart.shippingAddress })}
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
      <CartSummary
        subtotalInCents={cartTotalInCents}
        products={cart.items.map((item) => ({
          id: item.productVariant.id,
          name: item.productVariant.product.name,
          variantName: item.productVariant.name,
          quantity: item.quantity,
          widthInCentimeters: item.productVariant.product.widthInCentimeters,
          heightInCentimeters: item.productVariant.product.heightInCentimeters,
          lengthInCentimeters: item.productVariant.product.lengthInCentimeters,
          weightInGrams: item.productVariant.product.weightInGrams,
          priceInCents: item.productVariant.priceInCents,
          imageUrl: item.productVariant.imageUrl,
        }))}
      >
        <Button className="w-full rounded-full" size="lg">
          Finalizar compra
        </Button>
      </CartSummary>
    </div>
  );
};

export default ConfirmationPage;
