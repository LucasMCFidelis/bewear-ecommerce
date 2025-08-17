import { z } from "zod";

import { createShippingAddressSchema } from "../create-shipping-address/schema";

export const updateDataShippingAddressSchema =
  createShippingAddressSchema.partial();

export type UpdateDataShippingAddressSchema = z.infer<
  typeof updateDataShippingAddressSchema
>;
