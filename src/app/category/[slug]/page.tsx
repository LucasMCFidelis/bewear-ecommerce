import { notFound } from "next/navigation";

import { getOneCategory } from "@/app/data/categories/get-one-category";
import ProductList from "@/components/common/product-item";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { slug } = await params;
  const category = await getOneCategory({
    withProducts: true,
    withVariants: true,
    where: [{ field: "slug", value: slug }],
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
