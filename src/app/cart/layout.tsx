import { redirect } from "next/navigation";

import { getCartData } from "@/app/data/cart/get-cart-data";

import { getManyShippingAddresses } from "../data/shippingAddress/get-many-shipping-addresses";
import { verifyUser } from "../data/user/verify-user";
import CartProvider from "./cart-context";

export default async function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await verifyUser();
  if (!user.id) redirect("/");

  const [cart, shippingAddresses] = await Promise.all([
    getCartData({
      userId: user.id,
      withShippingAddress: true,
      withItems: true,
      withProductVariant: true,
      withProduct: true,
    }),
    getManyShippingAddresses({
      userId: user.id,
    }),
  ]);

  if (!cart) throw new Error("Cart Not Found");

  return (
    <CartProvider
      shippingAddresses={shippingAddresses}
      defaultShippingAddressId={cart.shippingAddress?.id}
      cartItems={cart.items}
    >
      {children}
    </CartProvider>
  );
}
