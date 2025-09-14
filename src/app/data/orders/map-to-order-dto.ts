import {
  orderItemTable,
  orderTable,
  productTable,
  productVariantTable,
  shippingAddressTable,
} from "@/db/schema";

import { canSeePrivacyAtribute } from "../can-see-privacy-atribute";
import { mapToOrderItemDTO } from "../order-item/map-to-order-item-dto";
import { mapToShippingAddressDTO } from "../shippingAddress/map-to-shipping-address-dto";
import { OrderDTO } from "./order-dto";

interface MapToOrderDTOProps<
  WithItems extends boolean = false,
  WithVariant extends boolean = false,
  WithProduct extends boolean = false,
  WithShipping extends boolean = false,
> {
  userId: string;
  data: typeof orderTable.$inferSelect & {
    items?: Array<
      typeof orderItemTable.$inferSelect & {
        productVariant?: typeof productVariantTable.$inferSelect & {
          product?: typeof productTable.$inferSelect;
        };
      }
    >;
    shippingAddress?: typeof shippingAddressTable.$inferSelect;
  };
  options: {
    withItems?: WithItems;
    withVariant?: WithVariant;
    withProduct?: WithProduct;
    withShipping?: WithShipping;
  };
}

export async function mapToOrderDTO<
  WithItems extends boolean = false,
  WithVariant extends boolean = false,
  WithProduct extends boolean = false,
  WithShipping extends boolean = false,
>({
  userId,
  data,
  options,
}: MapToOrderDTOProps<
  WithItems,
  WithVariant,
  WithProduct,
  WithShipping
>): Promise<OrderDTO<WithItems, WithVariant, WithProduct, WithShipping>> {
  const canSee = await canSeePrivacyAtribute(userId);

  const base = {
    id: data.id,
    number: data.number,
    userId: data.userId,
    createdAt: new Date(data.createdAt),
    shippingAddressId: data.shippingAddressId,
    complement: data.complement,
    email: canSee ? data.email : null,
    recipientName: data.recipientName,
    street: data.street,
    city: data.city,
    state: data.state,
    neighborhood: data.neighborhood,
    zipCode: data.zipCode,
    country: data.country,
    phone: data.phone,
    cpfOrCnpj: canSee ? data.cpfOrCnpj : null,
    subtotalPriceInCents: data.subtotalPriceInCents,
    shippingCostInCents: data.shippingCostInCents,
    totalPriceInCents: data.totalPriceInCents,
    status: data.status as "pending" | "paid" | "canceled",
    checkoutSessionId: data.checkoutSessionId,
    checkoutSessionUrl: canSee ? data.checkoutSessionUrl : null,
  };

  // Items
  const items = options.withItems
    ? (data.items?.map((item) =>
        mapToOrderItemDTO({
          data: item,
          options: {
            withVariant: options.withVariant,
            withProduct: options.withProduct,
          },
        })
      ) ?? [])
    : undefined;

  // Shipping
  const shipping =
    options.withShipping && data.shippingAddress
      ? await mapToShippingAddressDTO({
          userId,
          shippingAddress: data.shippingAddress,
        })
      : undefined;

  return {
    ...base,
    ...(options.withItems ? { items } : { items: undefined }),
    ...(options.withShipping
      ? { shippingAddress: shipping! }
      : { shippingAddress: undefined }),
  } as OrderDTO<WithItems, WithVariant, WithProduct, WithShipping>;
}
