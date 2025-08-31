export interface ProductDTO {
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
}
