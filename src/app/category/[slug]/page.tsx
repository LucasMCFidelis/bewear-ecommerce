import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import ProductList from "@/components/common/product-item";
import { db } from "@/db";
import { categoryTable } from "@/db/schema";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { slug } = await params;
  const category = await db.query.categoryTable.findFirst({
    where: eq(categoryTable.slug, slug),
    with: {
      products: { with: { variants: true } },
    },
  });

  if (!category) {
    return notFound();
  }
  return (
    <>
      <div className="px-5 space-y-6">
          <h2 className="text-xl font-semibold">{category.name}</h2>
          <div className="grid grid-cols-2 gap-4">
            {category.products.map((product) => (
              <ProductList key={product.id} product={product} />
            ))}
          </div>
      </div>
    </>
  );
};

export default CategoryPage;
