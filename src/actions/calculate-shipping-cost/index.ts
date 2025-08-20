"use server";

import axios, { isAxiosError } from "axios";

import { getCart } from "../get-cart";

export const calculateShippingCost = async () => {
  const cart = await getCart();

  let response;
  try {
    response = await axios.post(
      "https://www.melhorenvio.com.br/api/v2/me/shipment/calculate",
      {
        from: {
          postal_code: process.env.NEXT_PUBLIC_FROM_POSTAL_CODE,
        },
        to: {
          postal_code: cart?.shippingAddress?.zipCode.replace("-", ""),
        },
        products: cart.items.map((item) => ({
          id: item.productVariant.id,
          width: item.productVariant.product.widthInCentimeters,
          height: item.productVariant.product.heightInCentimeters,
          length: item.productVariant.product.lengthInCentimeters,
          weight: item.productVariant.product.weightInGrams / 1000,
          insurance_value: item.productVariant.priceInCents / 100,
          quantity: item.quantity,
        })),
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
};
