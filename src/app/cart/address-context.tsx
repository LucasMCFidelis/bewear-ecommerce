"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface ShippingAddressContextProps {
  selectedShippingAddress: string | null;
  setSelectedShippingAddress: Dispatch<SetStateAction<string | null>>;
}
interface ShippingAddressProviderProps {
  children: React.ReactNode;
  defaultShippingAddressId?: string;
}

const ShippingAddressContext = createContext({} as ShippingAddressContextProps);

const ShippingAddressProvider = ({
  children,
  defaultShippingAddressId,
}: ShippingAddressProviderProps) => {
  const [selectedShippingAddress, setSelectedShippingAddress] = useState<string | null>(
    defaultShippingAddressId || null
  );
  return (
    <ShippingAddressContext.Provider
      value={{ selectedShippingAddress, setSelectedShippingAddress }}
    >
      {children}
    </ShippingAddressContext.Provider>
  );
};

export const useShippingAddressContext = () =>
  useContext(ShippingAddressContext);

export default ShippingAddressProvider;
