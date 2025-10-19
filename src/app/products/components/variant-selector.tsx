import Image from "next/image";
import Link from "next/link";

import { ProductVariantDTO } from "@/app/data/product-variant/product-variant-dto";
import { cn } from "@/lib/utils";

interface VariantSelectorProps {
  selectedVariantSlug: string;
  variants?: Array<ProductVariantDTO>;
  className?: string;
}

const VariantSelector = ({
  selectedVariantSlug,
  variants,
  className,
}: VariantSelectorProps) => {
  return (
    <>
      {variants && (
        <div className={cn("flex items-center gap-4", className)}>
          {variants.map((variant) => (
            <Link
              href={`/products?variantSlug=${variant.slug}`}
              key={variant.id}
              className={`relative size-16 md:size-24 lg:size-28 ${
                selectedVariantSlug === variant.slug
                  ? "border-primary rounded-xl border-2"
                  : ""
              }`}
            >
              <Image
                fill
                src={variant.imageUrl}
                alt={variant.name}
                className="rounded-xl"
              />
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default VariantSelector;
