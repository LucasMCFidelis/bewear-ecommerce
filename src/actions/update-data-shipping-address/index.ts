"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { getOneShippingAddress } from "@/app/data/shippingAddress/get-one-shipping-address";
import { verifyUser } from "@/app/data/user/verify-user";
import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";

import { updateCartShippingAddress } from "../update-cart-shipping-address";
import {
  UpdateDataShippingAddressSchema,
  updateDataShippingAddressSchema,
} from "./schema";

export interface UpdateDataShippingAddressProps {
  shippingAddressId: string;
  data: UpdateDataShippingAddressSchema;
}

export const updateDataShippingAddress = async ({
  shippingAddressId,
  data,
}: UpdateDataShippingAddressProps) => {
  updateDataShippingAddressSchema.parse(data);

  const user = await verifyUser();

  await getOneShippingAddress({
    userId: user.id,
    shippingAddressId: shippingAddressId,
  });

  const [[shippingAddress], isActualizedShippingCart] = await Promise.all([
    db
      .update(shippingAddressTable)
      .set({
        recipientName: data.fullName,
        street: data.address,
        number: data.number,
        complement: data.complement || null,
        city: data.city,
        state: data.state,
        neighborhood: data.neighborhood,
        zipCode: data.zipCode,
        country: "Brasil",
        phone: data.phone,
        email: data.email,
        cpfOrCnpj: data.cpf,
      })
      .where(eq(shippingAddressTable.id, shippingAddressId))
      .returning(),
    updateCartShippingAddress({ shippingAddressId }),
  ]);

  if (!isActualizedShippingCart) {
    throw new Error("Shipping address could not be updated");
  }

  revalidatePath("/cart/identification");

  return shippingAddress;
};
