import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";

import { canSeePrivacyAtribute } from "../can-see-privacy-atribute";
import { verifyUser } from "../user/verify-user";
import { ShippingAddressDTO } from "./shipping-address-dto";

interface getManyShippingAddressesProps {
  userId: string;
}

export const getManyShippingAddresses = async ({
  userId,
}: getManyShippingAddressesProps): Promise<Array<ShippingAddressDTO>> => {
  await verifyUser();
  const [canSee, shippingAddresses] = await Promise.all([
    canSeePrivacyAtribute(userId),
    db.query.shippingAddressTable.findMany({
      where: eq(shippingAddressTable.userId, userId),
    }),
  ]);

  const shippingAddressDataVisibly: Array<ShippingAddressDTO> =
    shippingAddresses.map((address) => {
      return {
        id: address.id,
        userId: address.userId,
        email: canSee ? address.email : null,
        recipientName: address.recipientName,
        street: address.street,
        number: address.number,
        complement: address.complement,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        country: address.country,
        zipCode: address.zipCode,
        phone: address.phone,
        cpfOrCnpj: canSee ? address.cpfOrCnpj : null,
        createdAt: address.createdAt,
      };
    });

  return shippingAddressDataVisibly;
};
