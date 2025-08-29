"use server";

import { eq } from "drizzle-orm";

import { verifyUser } from "@/app/data/user/verify-user";
import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";

const getUserAddress = async () => {
  const user = await verifyUser();

  try {
    const addresses = await db
      .select()
      .from(shippingAddressTable)
      .where(eq(shippingAddressTable.userId, user.id))
      .orderBy(shippingAddressTable.createdAt);

    return addresses;
  } catch (error) {
    console.error("Erro ao buscar endereços:", error);
    throw new Error("Erro ao buscar endereços");
  }
};

export default getUserAddress;
