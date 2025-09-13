"use server";

import { verifyUser } from "@/app/data/user/verify-user";
import { db } from "@/db";
import { directBuyPretensionTable } from "@/db/schema";

import {
  CreateDirectBuyPretensionSchema,
  createDirectBuyPretensionSchema,
} from "./schema";

export const createDirectBuyPretension = async (
  data: CreateDirectBuyPretensionSchema
) => {
  console.log("data in create direct buy",data);
  
  createDirectBuyPretensionSchema.parse(data);
  const user = await verifyUser();

  if (data.userId !== user.id){
    throw new Error("Unauthorized");
  }

  const [directBuyPretension] = await db
    .insert(directBuyPretensionTable)
    .values({
      productVariantId: data.productVariantId,
      userId: data.userId,
      priceInCents: data.priceInCents,
      quantity: data.quantity,
    })
    .returning();

  return directBuyPretension;
};
