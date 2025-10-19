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
    withCategory: true,
    where: [{ field: "CATEGORY_ID", value: productVariant.product.categoryId }],
    orderBy: [{ field: "NAME", type: "asc" }],
  });

  return (
    <>
      <div className="flex flex-col gap-6 px-5 sm:grid sm:grid-cols-2">
        <Image
          src={productVariant.imageUrl}
          alt={productVariant.name}
          sizes="100vw"
          height={0}
          width={0}
          className="h-auto w-full object-cover rounded-3xl md:row-span-full col-start-1"
        />

        <div className="grid h-fit gap-6">
          <VariantSelector
            variants={productVariant.product.variants}
            selectedVariantSlug={productVariant.slug}
            className="sm:row-start-2"
          />
          <div className="sm:row-start-1 h-fit">
            <h2 className="font-semibold md:text-xl">{productVariant.product.name}</h2>
            <h3 className="text-muted-foreground text-sm sm:text-base">
              {productVariant.name}
            </h3>
            <h2 className="text-lg md:text-xl font-semibold">
              {formatCentsToBRL(productVariant.priceInCents)}
            </h2>
          </div>
          <ProductActions
            productVariant={productVariant}
            className="sm:row-start-3"
          />
          <p className="text-sm md:text-base">{productVariant.product.description}</p>
        </div>
        <ProductsList
          title="Talvez você goste"
          products={likelyProducts}
          redirectToViewMore={`/category/${likelyProducts[0].category?.slug}`}
          className="sm:col-span-full"
        />
      </div>
    </>
  );
};

export default ProductPage;
