"use server";

import axios, { isAxiosError } from "axios";

import { getOneDirectBuy } from "@/app/data/direct-buy/get-one-direct-buy";

import { getCart } from "../get-cart";

export type CalculateShippingCostProps<
  TypeDataBase extends "to-cart" | "to-direct",
> = {
  typeDataBase: TypeDataBase;
} & (TypeDataBase extends "to-direct"
  ? { directBuyId: string }
  : { directBuyId?: string });

export async function calculateShippingCost<
  TypeDataBase extends "to-cart" | "to-direct",
>({ typeDataBase, directBuyId }: CalculateShippingCostProps<TypeDataBase>) {
  const [cart, directBuy] = await Promise.all([
    getCart(),
    typeDataBase === "to-direct" && directBuyId
      ? getOneDirectBuy({
          withVariant: true,
          withProduct: true,
          where: [{ field: "ID", value: directBuyId }],
        })
      : null,
  ]);

  if (typeDataBase === "to-direct" && directBuyId && !directBuy) {
    throw new Error("directBuy not found");
  }
  const data =
    typeDataBase === "to-direct" && directBuy
      ? {
          shippingAddress: cart.shippingAddress,
          ...directBuy,
          products: [
            {
              id: directBuy.id,
              width: directBuy.productVariant.product.widthInCentimeters,
              height: directBuy.productVariant.product.heightInCentimeters,
              length: directBuy.productVariant.product.lengthInCentimeters,
              weight: directBuy.productVariant.product.weightInGrams / 1000,
              insurance_value: directBuy.productVariant.priceInCents / 100,
              quantity: directBuy.quantity,
            },
          ],
        }
      : cart;
  const products =
    typeDataBase === "to-direct" && directBuy
      ? [
          {
            id: directBuy.id,
            width: directBuy.productVariant.product.widthInCentimeters,
            height: directBuy.productVariant.product.heightInCentimeters,
            length: directBuy.productVariant.product.lengthInCentimeters,
            weight: directBuy.productVariant.product.weightInGrams / 1000,
            insurance_value: directBuy.productVariant.priceInCents / 100,
            quantity: directBuy.quantity ?? 1, // fallback se não vier
          },
        ]
      : cart.items.map((item) => ({
          id: item.productVariant.id,
          width: item.productVariant.product.widthInCentimeters,
          height: item.productVariant.product.heightInCentimeters,
          length: item.productVariant.product.lengthInCentimeters,
          weight: item.productVariant.product.weightInGrams / 1000,
          insurance_value: item.productVariant.priceInCents / 100,
          quantity: item.quantity,
        }));

  let response;
  try {
    response = await axios.post(
      "https://www.melhorenvio.com.br/api/v2/me/shipment/calculate",
      {
        from: {
          postal_code: process.env.NEXT_PUBLIC_FROM_POSTAL_CODE,
        },
        to: {
          postal_code: data?.shippingAddress?.zipCode.replace("-", ""),
        },
        products,
        services: "1",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN_MELHOR_ENVIO}`,
          Accept: "application/json",
          "Content-Type": "application/json",
          "User-Agent": "bewear lucasm241301@gmail.com",
        },
      }
    );
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Erro na resposta da API:", error?.response?.data);
      throw new Error(error.response?.data.message || "Erro desconhecido");
    } else {
      console.error("Erro na requisição:", error);
      throw new Error("Erro na requisição");
    }
  }

  if (response.data.error) {
    throw new Error(response.data.error);
  }

  return {
    success: true,
    data: {
      freightInCents: response.data.price * 100,
      delivery_time: response.data.delivery_time,
    },
  };
}
