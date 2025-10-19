"use client";

import Link from "next/link";

import { ProductDTO } from "@/app/data/products/product-dto";
import { cn } from "@/lib/utils";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import ProductItem from "./product-item";

type ProductsListProps = {
  title: string;
  products: Array<ProductDTO<true>>;
  redirectToViewMore?: string;
  className?: string;
};

const ProductsList = ({
  title,
  products,
  className,
  redirectToViewMore,
}: ProductsListProps) => {
  return (
    <Carousel className={cn("space-y-6", className)}>
      <div className="flex justify-between">
        <h3 className="font-semibold">{title}</h3>
        <div className="flex">
          {redirectToViewMore && (
            <Link href={redirectToViewMore} className="md:mr-24">
              Ver todos
            </Link>
          )}
          <div className="hidden md:flex relative top-0 right-10">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </div>
      </div>
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem
            key={product.id}
            className="basis-1/2 md:basis-1/3 lg:basis-1/4"
          >
            <ProductItem product={product} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default ProductsList;
