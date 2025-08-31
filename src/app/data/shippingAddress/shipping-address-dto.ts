export interface ShippingAddressDTO {
  number: string;
  userId: string;
  id: string;
  email: string | null;
  createdAt: Date;
  recipientName: string;
  street: string;
  complement: string | null;
  city: string;
  state: string;
  neighborhood: string;
  zipCode: string;
  country: string;
  phone: string;
  cpfOrCnpj: string | null;
}
