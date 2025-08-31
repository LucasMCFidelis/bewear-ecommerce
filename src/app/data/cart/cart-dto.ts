import { ProductDTO } from "../products/product-dto";
import { ProductVariantDTO } from "../products/product-variant-dto";
import { ShippingAddressDTO } from "../shippingAddress/shipping-address-dto";
import { CartItemsDTO } from "./cart-items-dto";

export type CartDTO<
  WithShipping extends boolean = false,
  WithItems extends boolean = false,
  WithVariant extends boolean = false,
  WithProduct extends boolean = false,
> = {
  userId: string;
  id: string;
  createdAt: Date;
  shippingAddressId: string | null;
  cartTotalInCents: number;
} & (WithShipping extends true
  ? { shippingAddress: ShippingAddressDTO | null }
  : { shippingAddress?: ShippingAddressDTO | null }) &
  (WithItems extends true
    ? {
        items: Array<
          CartItemsDTO &
            (WithVariant extends true
              ? {
                  productVariant: ProductVariantDTO &
                    (WithProduct extends true
                      ? { product: ProductDTO }
                      : { product?: ProductDTO | null });
                }
              : { productVariant?: ProductVariantDTO | null })
        >;
      }
    : { items?: CartItemsDTO[] });
