import { CartBaseDTO } from "../cart/cart-dto";
import { ProductVariantDTO } from "../product-variant/product-variant-dto";

export type CartItemsDTO<
  WithCart extends boolean = false,
  WithVariant extends boolean = false,
> = {
  id: string;
  createdAt: Date;
  cartId: string;
  productVariantId: string;
  quantity: number;
} & (WithCart extends true
  ? { cart: CartBaseDTO }
  : { cart?: CartBaseDTO }) &
  (WithVariant extends true
    ? { productVariant: ProductVariantDTO }
    : { productVariant?: ProductVariantDTO });
