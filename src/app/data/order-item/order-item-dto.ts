import { ProductVariantDTO } from "../product-variant/product-variant-dto";

export type OrderItemDTO<
  WithVariant extends boolean = false,
  WithProduct extends boolean = false,
> = {
  orderId: string;
  id: string;
  createdAt: Date;
  priceInCents: number;
  productVariantId: string;
  quantity: number;
} & (WithVariant extends true
  ? { productVariant: ProductVariantDTO<WithProduct> }
  : { productVariant?: ProductVariantDTO<WithProduct> });
