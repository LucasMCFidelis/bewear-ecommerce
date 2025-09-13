import { useMutation } from "@tanstack/react-query";

import { createDirectBuyPretension } from "@/actions/create-direct-buy-pretension";
import { CreateDirectBuyPretensionSchema } from "@/actions/create-direct-buy-pretension/schema";

export const getCreateDirectBuyPretensionMutationKey = () =>
  ["create-direct-buy-pretension"] as const;

export const useCreateDirectBuyPretension = () => {
  return useMutation({
    mutationKey: getCreateDirectBuyPretensionMutationKey(),
    mutationFn: async (data: CreateDirectBuyPretensionSchema) => {
      return await createDirectBuyPretension(data);
    },
  });
};
