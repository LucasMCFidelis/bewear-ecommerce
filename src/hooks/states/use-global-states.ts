"use client";

import { parseAsBoolean, useQueryStates } from "nuqs";

export const useGlobalStates = () => {
  return useQueryStates({
    isCartOpen: parseAsBoolean.withDefault(false),
  });
};
