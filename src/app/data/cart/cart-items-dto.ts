import { ProductVariantDTO } from "../products/product-variant-dto";

export interface CartItemsDTO {
  id: string;
  createdAt: Date;
  cartId: string;
  productVariantId: string;
  quantity: number;
  productVariant?: ProductVariantDTO;
}
