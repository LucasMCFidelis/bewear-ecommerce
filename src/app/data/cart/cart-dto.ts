import { CartItemsDTO } from "../cart-item/cart-items-dto";
import { ProductVariantDTO } from "../product-variant/product-variant-dto";
import { ProductDTO } from "../products/product-dto";
import { ShippingAddressDTO } from "../shippingAddress/shipping-address-dto";

export type CartBaseDTO = {
  userId: string;
  id: string;
  createdAt: Date;
  shippingAddressId: string | null;
  cartTotalInCents: number;
}

export type CartDTO<
  WithShipping extends boolean = false,
  WithItems extends boolean = false,
  WithVariant extends boolean = false,
  WithProduct extends boolean = false,
> = CartBaseDTO & (WithShipping extends true
  ? { shippingAddress: ShippingAddressDTO | null }
  : { shippingAddress?: ShippingAddressDTO | null }) &
  (WithItems extends true
    ? {
        items: Array<
          CartItemsDTO<true, WithVariant> &
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
