import { asc, desc } from "drizzle-orm";
import Image from "next/image";

import CategorySelector from "@/components/common/category-selector";
import ProductsList from "@/components/common/products-list";
import { db } from "@/db";
import { categoryTable, productTable } from "@/db/schema";

export default async function Home() {
  const products = await db.query.productTable.findMany({
    with: { variants: true },
  });
  const newlyCreatedProducts = await db.query.productTable.findMany({
    orderBy: [desc(productTable.createdAt)],
    with: { variants: true },
  });
  const categories = await db.query.categoryTable.findMany({
    orderBy: [asc(categoryTable.name)],
  });

  return (
    <div className="px-5 space-y-6">
      <Image
        src={"/banner-01.png"}
        alt="Leve uma vida com estilo"
        height={0}
        width={0}
        sizes="100vw"
        className="h-auto w-full"
      />

      <ProductsList products={products} title="Mais vendidos" />

      <CategorySelector categories={categories} />

      <Image
        src={"/banner-02.png"}
        alt="Leve uma vida com estilo"
        height={0}
        width={0}
        sizes="100vw"
        className="h-auto w-full"
      />

      <ProductsList products={newlyCreatedProducts} title="Novos produtos" />
    </div>
  );
}
