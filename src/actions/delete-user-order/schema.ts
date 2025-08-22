import { z } from "zod";

export const deleteUserOrderSchema = z.object({
  orderId: z.uuid(),
});

export type DeleteUserOrderSchema = z.infer<
  typeof deleteUserOrderSchema
>;
