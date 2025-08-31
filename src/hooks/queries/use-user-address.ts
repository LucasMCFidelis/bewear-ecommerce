import { useQuery } from "@tanstack/react-query";

import getUserAddress from "@/actions/get-user-addresses";
import { getManyShippingAddresses } from "@/app/data/shippingAddress/get-many-shipping-addresses";

export const getUserAddressesQueryKey = () => ["user-addresses"] as const;

export const useUserAddresses = (params?: {
  initialData?: Awaited<ReturnType<typeof getManyShippingAddresses>>;
}) => {
  return useQuery({
    queryKey: getUserAddressesQueryKey(),
    queryFn: getUserAddress,
    initialData: params?.initialData,
  });
};
