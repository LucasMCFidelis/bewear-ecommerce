import { ProductVariantDTO } from "./product-variant-dto";

export type ProductDTO<WithVariant extends boolean = false>  = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  widthInCentimeters: number;
  heightInCentimeters: number;
  lengthInCentimeters: number;
  weightInGrams: number;
  createdAt: Date;
} & (WithVariant extends true? {
  variants: Array<ProductVariantDTO>
} : {variants?: Array<ProductVariantDTO>})
