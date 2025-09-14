import { OrderItemDTO } from "../order-item/order-item-dto";
import { ShippingAddressDTO } from "../shippingAddress/shipping-address-dto";

export type OrderDTO<
  WithItems extends boolean = false,
  WithVariant extends boolean = false,
  WithProduct extends boolean = false,
  WithShipping extends boolean = false,
> = {
  number: string;
  id: string;
  userId: string;
  createdAt: Date;
  shippingAddressId: string;
  complement: string | null;
  email?: string;
  recipientName: string;
  street: string;
  city: string;
  state: string;
  neighborhood: string;
  zipCode: string;
  country: string;
  phone: string;
  cpfOrCnpj?: string;
  subtotalPriceInCents: number;
  shippingCostInCents: number;
  totalPriceInCents: number;
  status: "pending" | "paid" | "canceled";
  checkoutSessionId: string | null;
  checkoutSessionUrl: string | null;
} & (WithItems extends true
  ? { items: Array<OrderItemDTO<WithVariant, WithProduct>> }
  : { items?: Array<OrderItemDTO<WithVariant, WithProduct>> }) &
  (WithShipping extends true
    ? { shippingAddress: ShippingAddressDTO }
    : { shippingAddress?: ShippingAddressDTO });
