import { ProductVariantDTO } from "../product-variant/product-variant-dto";
import { ProductDTO } from "../products/product-dto";

export type DirectBuyDTO<
  WithVariant extends boolean = false,
  WithProduct extends boolean = false,
> = {
  id: string;
  createdAt: Date;
  userId: string;
  priceInCents: number;
  productVariantId: string;
  quantity: number;
} & (WithVariant extends true
  ? {
      productVariant: ProductVariantDTO &
        (WithProduct extends true
          ? { product: ProductDTO }
          : { product?: ProductDTO | null });
    }
  : { productVariant?: ProductVariantDTO | null });
