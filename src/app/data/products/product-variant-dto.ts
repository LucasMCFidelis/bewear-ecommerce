import { ProductDTO } from "./product-dto";

export interface ProductVariantDTO {
  id: string;
  name: string;
  createdAt: Date;
  slug: string;
  productId: string;
  color: string;
  priceInCents: number;
  imageUrl: string;
  quantityInStock: number;
  product?: ProductDTO | null;
}
