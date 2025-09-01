import Image from "next/image";
import Marquee from "react-fast-marquee";

import CategorySelector from "@/components/common/category-selector";
import ProductsList from "@/components/common/products-list";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getPngFiles } from "@/helpers/getPngFiles";

import { getAllCategories } from "./data/categories/get-all-categories";
import { getProducts } from "./data/products/get-products";

export default async function Home() {
  const products = await getProducts({ withProductVariants: true });
  const newlyCreatedProducts = await getProducts({
    withProductVariants: true,
    orderBy: [{ type: "desc", field: "createdAt" }],
  });
  const categories = await getAllCategories({
    withProducts: true,
    withVariants: true,
    orderBy: [{ type: "asc", field: "name" }],
  });

  const partnerBrandsLogos = getPngFiles({
    folderPath: "partner-brands-logos",
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

      <div className="space-y-6">
        <h3 className="font-semibold">Marcas Parceiras</h3>
        <Marquee
          className="flex items-center justify-between"
          speed={30}
          gradient={false}
        >
          {partnerBrandsLogos.map(({ path: logoPath, name }) => (
            <Card
              key={name}
              className="h-28 min-w-20 w-fit flex flex-col items-center justify-center mr-8 border-0 shadow-none"
            >
              <CardContent>
                <Image
                  width={32}
                  height={32}
                  src={logoPath}
                  alt={`${name} Logo`}
                />
              </CardContent>
              <CardFooter>
                <h3 className="font-medium">{name}</h3>
              </CardFooter>
            </Card>
          ))}
        </Marquee>
      </div>

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
