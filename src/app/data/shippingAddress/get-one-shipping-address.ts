import "server-only";

import { db } from "@/db";

import { canSeePrivacyAtribute } from "../can-see-privacy-atribute";
import { verifyUser } from "../user/verify-user";
import { ShippingAddressDTO } from "./shipping-address-dto";

interface getOneShippingAddressProps {
  userId: string;
  shippingAddressId: string;
}

export const getOneShippingAddress = async ({
  userId,
  shippingAddressId,
}: getOneShippingAddressProps): Promise<ShippingAddressDTO> => {
  const user = await verifyUser();
  const [canSee, shippingAddress] = await Promise.all([
    canSeePrivacyAtribute(userId),
    db.query.shippingAddressTable.findFirst({
      where: (shippingAddress, { eq, and }) =>
        and(
          eq(shippingAddress.id, shippingAddressId),
          eq(shippingAddress.userId, user.id)
        ),
    }),
  ]);

  if (!shippingAddress)
    throw new Error("Shipping Address not found or unauthorized");

  return {
    id: shippingAddress.id,
    userId: shippingAddress.userId,
    email: canSee ? shippingAddress.email : null,
    recipientName: shippingAddress.recipientName,
    street: shippingAddress.street,
    number: shippingAddress.number,
    complement: shippingAddress.complement,
    neighborhood: shippingAddress.neighborhood,
    city: shippingAddress.city,
    state: shippingAddress.state,
    country: shippingAddress.country,
    zipCode: shippingAddress.zipCode,
    phone: shippingAddress.phone,
    cpfOrCnpj: canSee ? shippingAddress.cpfOrCnpj : null,
    createdAt: shippingAddress.createdAt,
  };
};
