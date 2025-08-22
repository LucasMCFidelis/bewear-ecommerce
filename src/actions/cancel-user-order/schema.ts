import { z } from "zod";

export const cancelUserOrderSchema = z.object({
  orderId: z.uuid(),
});

export type CancelUserOrderSchema = z.infer<typeof cancelUserOrderSchema>;
