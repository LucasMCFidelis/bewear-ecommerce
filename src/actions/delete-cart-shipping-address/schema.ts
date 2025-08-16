import { z } from "zod";

export const deleteCartShippingAddressSchema = z.object({
  shippingAddressId: z.uuid(),
});

export type DeleteCartShippingAddressSchema = z.infer<
  typeof deleteCartShippingAddressSchema
>;
