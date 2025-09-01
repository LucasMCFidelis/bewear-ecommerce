import { ProductDTO } from "../products/product-dto";

export type CategoryDTO<
  WithProducts extends boolean = false,
  WithVariants extends boolean = false,
> = {
  name: string;
  id: string;
  slug: string;
  createdAt: Date;
} & (WithProducts extends true
  ? { products: Array<ProductDTO<WithVariants>> }
  : { products?: Array<ProductDTO<WithVariants>> });
