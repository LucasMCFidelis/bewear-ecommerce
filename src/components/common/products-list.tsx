"useClient";

import { productTable, productVariantTable } from "@/db/schema";
import { cn } from "@/lib/utils";

import ProductItem from "./product-item";

type ProductsListProps = {
  title: string;
  products: (typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[];
  })[];
  className?: string;
};

const ProductsList = ({ title, products, className }: ProductsListProps) => {
  return (
    <div className={cn("space-y-6", className)}>
      <h3 className="font-semibold">{title}</h3>
      <div
        className={
          "grid w-full gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden grid-flow-col auto-cols-[min(70%)] sm:auto-cols-[min(40%)] md:auto-cols-[min(30%)] lg:auto-cols-[min(24%)]"
        }
      >
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
