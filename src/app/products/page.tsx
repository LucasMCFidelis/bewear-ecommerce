import Image from "next/image";
import { notFound } from "next/navigation";

import { getOneProductVariant } from "@/app/data/product-variant/get-one-product-variant";
import { getProducts } from "@/app/data/products/get-products";
import ProductsList from "@/components/common/products-list";
import { formatCentsToBRL } from "@/helpers/money";

import ProductActions from "./components/product-actions";
import VariantSelector from "./components/variant-selector";

interface ProductPageProps {
  searchParams: Promise<{ variantSlug: string }>;
}

const ProductPage = async ({ searchParams }: ProductPageProps) => {
  const { variantSlug } = await searchParams;
  const productVariant = await getOneProductVariant({
    withProduct: true,
    withVariants: true,
    where: [{ field: "SLUG", value: variantSlug }],
  });

  if (!productVariant) {
    return notFound();
  }

  const likelyProducts = await getProducts({
    withProductVariants: true,
    where: [{ field: "CATEGORY_ID", value: productVariant.product.categoryId }],
    orderBy: [{ field: "NAME", type: "asc" }],
  });

  return (
    <>
      <div className="flex flex-col space-y-6 px-5">
        <Image
          src={productVariant.imageUrl}
          alt={productVariant.name}
          sizes="100vw"
          height={0}
          width={0}
          className="h-auto w-full object-cover rounded-3xl"
        />

        <VariantSelector
          variants={productVariant.product.variants}
          selectedVariantSlug={productVariant.slug}
        />

        <div>
          <h2 className="font-semibold">{productVariant.product.name}</h2>
          <h3 className="text-muted-foreground text-sm">
            {productVariant.name}
          </h3>
          <h2 className="text-lg font-semibold">
            {formatCentsToBRL(productVariant.priceInCents)}
          </h2>
        </div>

        <ProductActions productVariant={productVariant} />

        <p className="text-sm">{productVariant.product.description}</p>

        <ProductsList title="Talvez você goste" products={likelyProducts} />
      </div>
    </>
  );
};

export default ProductPage;
