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
    orderBy: [{ type: "desc", field: "CREATED_AT" }],
  });
  const categories = await getAllCategories({
    withProducts: true,
    withVariants: true,
    orderBy: [{ type: "asc", field: "NAME" }],
  });

  const partnerBrandsLogos = getPngFiles({
    folderPath: "partner-brands-logos",
  });

  return (
    <div className="w-full max-w-screen px-5 mx-auto">
      <div className="grid-areas-layout-main w-full">
        <div className="flex w-full h-auto aspect-[6/8] sm:aspect-[9/4] relative bg-gradient-to-b from-primary to-[#D4D7E4] rounded-3xl grid-area-banner1 overflow-hidden">
          <Image
            src="/banner-01.png"
            alt="Leve uma vida com estilo"
            fill
            className="z-10 px-3 object-contain"
          />
          <div className="flex flex-col gap-4 text-white uppercase mx-auto mt-[15%] sm:mt-[10%] max-w-[90%]">
            <span className="font-medium text-xs">Leve uma</span>
            <div className="flex flex-col md:flex-row gap-x-7 font-anton text-7xl lg:text-[10rem] leading-none overflow-hidden break-words">
              <span className="z-0">Vida com </span>
              <span className="z-20 md:z-0">Estilo</span>
            </div>
            <div className="hidden md:flex flex-1 flex-col">
              <span className="font-medium text-xs uppercase max-w-32">
                VISTA-SE COM ATITUDE.
              </span>
              <span className="font-medium text-xs uppercase max-w-32 self-end">
                CONFORTO & PERSONALIDADE.
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6 grid-area-marquee overflow-hidden">
          <h3 className="font-semibold">Marcas Parceiras</h3>
          <Marquee className="flex items-center" speed={30} gradient={false}>
            {partnerBrandsLogos.map(({ path: logoPath, name }) => (
              <Card
                key={name}
                className="h-28 min-w-[5rem] flex-shrink-0 w-fit flex flex-col items-center justify-center mr-8 border-0 shadow-none"
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

        <ProductsList
          products={products}
          title="Mais vendidos"
          className="grid-area-product-list min-w-0"
        />

        <CategorySelector categories={categories} />

        <Image
          src={"/banner-02.png"}
          alt="Leve uma vida com estilo"
          height={0}
          width={0}
          sizes="100vw"
          className="h-auto w-full grid-area-banner2"
        />

        <ProductsList
          products={newlyCreatedProducts}
          title="Novos produtos"
          className="grid-area-product-list-newly-created min-w-0"
        />
      </div>
    </div>
  );
}
