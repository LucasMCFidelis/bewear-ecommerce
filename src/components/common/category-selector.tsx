import Link from "next/link";

import { CategoryDTO } from "@/app/data/categories/category-dto";

import { Button } from "../ui/button";

interface CategorySelectorProps {
  categories?: Array<CategoryDTO>;
}

const CategorySelector = ({ categories }: CategorySelectorProps) => {
  return (
    <>
      {categories && (
        <div className="rounded-3xl bg-muted p-6">
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="ghost"
                className="rounded-full bg-white text-xs font-semibold"
                asChild
              >
                <Link href={`/category/${category.slug}`}>{category.name}</Link>
              </Button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default CategorySelector;
