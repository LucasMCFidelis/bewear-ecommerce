import Link from "next/link";

import { Button } from "@/components/ui/button";

import CheckoutDialog from "../components/checkout-dialog";

const CheckoutSuccessPage = () => {
  return (
    <CheckoutDialog
      imageUrl={"/illustration-order-confirmed.svg"}
      imageAlt={"Success"}
      dialogTitle={"Pedido efetuado!"}
      dialogDescription="Seu pedido foi efetuado com sucesso. Você pode acompanhar o status na seção de “Meus Pedidos”."
      dialogComplementAction={
        <Button className="rounded-full" size="lg">
          <Link href={"/orders"}>Ver meus pedidos</Link>
        </Button>
      }
    />
  );
};

export default CheckoutSuccessPage;
