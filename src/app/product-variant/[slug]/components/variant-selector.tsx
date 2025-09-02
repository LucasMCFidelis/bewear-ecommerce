import Image from "next/image";
import Link from "next/link";

import { ProductVariantDTO } from "@/app/data/product-variant/product-variant-dto";

interface VariantSelectorProps {
  selectedVariantSlug: string;
  variants?: Array<ProductVariantDTO>;
}

const VariantSelector = ({
  selectedVariantSlug,
  variants,
}: VariantSelectorProps) => {
  return (
    <>
      {variants && (
        <div className="flex items-center gap-4">
          {variants.map((variant) => (
            <Link
              href={`/product-variant/${variant.slug}`}
              key={variant.id}
              className={
                selectedVariantSlug === variant.slug
                  ? "border-primary rounded-xl border-2"
                  : ""
              }
            >
              <Image
                width={68}
                height={68}
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
