import { shippingAddressTable } from "@/db/schema";

export function formatAddress({
  address,
}: {
  address: typeof shippingAddressTable.$inferSelect;
}) {
  return `
  ${address.recipientName} • ${address.street}, ${address.number}${
    address.complement ? `, ${address.complement}` : ""
  }, ${address.neighborhood}, ${address.city} - ${address.state} • CEP: ${
    address.zipCode
  }  
  `;
}
