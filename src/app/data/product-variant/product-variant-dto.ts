import { ProductDTO } from "../products/product-dto";

export type ProductVariantDTO<
  WithProduct extends boolean = false,
  WithVariants extends boolean = false,
> = {
  id: string;
  name: string;
  createdAt: Date;
  slug: string;
  productId: string;
  color: string;
  priceInCents: number;
  imageUrl: string;
  quantityInStock: number;
} & (WithProduct extends true
  ? { product: ProductDTO<WithVariants> }
  : { product?: ProductDTO<WithVariants> });
