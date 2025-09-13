import { z } from "zod";

export const createDirectBuyPretensionSchema = z.object({
  productVariantId: z.uuid(),
  userId: z.string(),
  quantity: z.int(),
  priceInCents: z.int(),
});

export type CreateDirectBuyPretensionSchema = z.infer<
  typeof createDirectBuyPretensionSchema
>;
