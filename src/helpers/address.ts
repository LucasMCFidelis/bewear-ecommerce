import { ShippingAddressDTO } from "@/app/data/shippingAddress/shipping-address-dto";

export function formatAddress({
  address,
}: {
  address: ShippingAddressDTO | null;
}) {
  if (!address) return "Endereço com problema para formatação";
  return `
  ${address.recipientName} • ${address.street}, ${address.number}${
    address.complement ? `, ${address.complement}` : ""
  }, ${address.neighborhood}, ${address.city} - ${address.state} • CEP: ${
    address.zipCode
  }  
  `;
}
