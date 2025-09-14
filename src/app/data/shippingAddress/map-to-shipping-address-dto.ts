import { shippingAddressTable } from "@/db/schema";

import { canSeePrivacyAtribute } from "../can-see-privacy-atribute";
import { ShippingAddressDTO } from "./shipping-address-dto";

interface MapToShippingAddressDTOProps {
  userId: string;
  shippingAddress: typeof shippingAddressTable.$inferSelect;
}

export async function mapToShippingAddressDTO({
  userId,
  shippingAddress,
}: MapToShippingAddressDTOProps): Promise<ShippingAddressDTO> {
  const canSee = await canSeePrivacyAtribute(userId);

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
}
