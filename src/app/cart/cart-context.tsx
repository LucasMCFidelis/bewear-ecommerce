"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";

import { CartItemsDTO } from "../data/cart-item/cart-items-dto";
import { ShippingAddressDTO } from "../data/shippingAddress/shipping-address-dto";

interface CartContextProps {
  shippingAddresses: Array<ShippingAddressDTO>;
  selectedShippingAddress: string | null;
  setSelectedShippingAddress: Dispatch<SetStateAction<string | null>>;
  productsInCart: Array<{
    id: string;
    name: string;
    variantName: string;
    quantity: number;
    priceInCents: number;
    widthInCentimeters: number;
    heightInCentimeters: number;
    lengthInCentimeters: number;
    weightInGrams: number;
    imageUrl: string;
  }>;
  cartSubTotalInCents: number;
}
interface CartProviderProps {
  children: React.ReactNode;
  shippingAddresses: Array<ShippingAddressDTO>;
  cartItems: Array<CartItemsDTO>;
  defaultShippingAddressId?: string;
}

const CartContext = createContext({} as CartContextProps);

const CartProvider = ({
  children,
  shippingAddresses,
  cartItems,
  defaultShippingAddressId,
}: CartProviderProps) => {
  const [selectedShippingAddress, setSelectedShippingAddress] = useState<
    string | null
  >(defaultShippingAddressId || null);

  const productsInCart = useMemo(
    () =>
      cartItems.map((item) => {
        if (!item.productVariant || !item.productVariant.product)
          throw new Error("Product or Product Variant not defined ");

        return {
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
        };
      }),
    [cartItems]
  );

  const cartSubTotalInCents = useMemo(
    () =>
      cartItems.reduce(
        (acc, item) =>
          acc +
          (item.productVariant ? item.productVariant.priceInCents : 0) *
            item.quantity,
        0
      ),
    [cartItems]
  );
  return (
    <CartContext.Provider
      value={{
        shippingAddresses,
        selectedShippingAddress,
        setSelectedShippingAddress,
        productsInCart,
        cartSubTotalInCents,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);

export default CartProvider;
