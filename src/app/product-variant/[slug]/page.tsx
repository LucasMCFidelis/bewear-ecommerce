import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";

import ProductsList from "@/components/common/products-list";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { productTable, productVariantTable } from "@/db/schema";
import { formatCentsToBRL } from "@/helpers/money";

import QuantitySelector from "./components/quantity-selector";
import VariantSelector from "./components/variant-selector";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug } = await params;
  const productVariant = await db.query.productVariantTable.findFirst({
    where: eq(productVariantTable.slug, slug),
    with: {
      product: { with: { variants: true } },
    },
  });

  if (!productVariant) {
    return notFound();
  }

  const likelyProducts = await db.query.productTable.findMany({
    where: eq(productTable.categoryId, productVariant.product.categoryId),
    with: { variants: true },
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

        <QuantitySelector quantityMax={productVariant.quantityInStock}/>

        <div className="space-y-4 flex flex-col">
          <Button className="rounded-full" variant={"outline"}>
            Adicionar à sacola
          </Button>
          <Button className="rounded-full" size={"lg"}>
            Comprar Agora
          </Button>
        </div>

        <p className="text-sm">{productVariant.product.description}</p>

        <ProductsList title="Talvez você goste" products={likelyProducts} />
      </div>
    </>
  );
};

export default ProductPage;
