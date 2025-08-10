import Image from "next/image";

import ProductsList from "@/components/common/products-list";
import { db } from "@/db";

export default async function Home() {
  const products = await db.query.productTable.findMany({
    with: { variants: true },
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

      <ProductsList products={products} title="Mais vendidos" />

      <Image
        src={"/banner-02.png"}
        alt="Leve uma vida com estilo"
        height={0}
        width={0}
        sizes="100vw"
        className="h-auto w-full"
      />
    </div>
  );
}
