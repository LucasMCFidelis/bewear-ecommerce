"use client";

import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { createCheckoutSession } from "@/actions/create-checkout-session";
import LoaderSpin from "@/components/common/loader-spin";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFinishOrder } from "@/hooks/mutations/use-finish-order";

const FinishOrderButton = () => {
  const finishOrderMutation = useFinishOrder();
  const [isConfirmationDialogIsOpen, setIsConfirmationDialogIsOpen] =
    useState<boolean>(false);

  const handleFinishOrder = async () => {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      throw new Error("Stripe publishable key is not set");
    }
    const { orderId } = await finishOrderMutation.mutateAsync();
    const checkoutSession = await createCheckoutSession({ orderId });
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    );
    if (!stripe) {
      throw new Error("Failed to load stripe");
    }
    await stripe.redirectToCheckout({
      sessionId: checkoutSession.id,
    });

    setIsConfirmationDialogIsOpen(true);
  };

  return (
    <>
      <Button
        className="w-full rounded-full"
        size="lg"
        onClick={handleFinishOrder}
        disabled={finishOrderMutation.isPending}
      >
        {finishOrderMutation.isPending ? (
          <>
            Finalizando sua compra
            <LoaderSpin />
          </>
        ) : (
          <>Finalizar compra</>
        )}
      </Button>
      <Dialog
        open={isConfirmationDialogIsOpen}
        onOpenChange={setIsConfirmationDialogIsOpen}
      >
        <DialogContent className="text-center ">
          <div className="relative w-full h-auto aspect-square">
            {finishOrderMutation.isError ? (
              <Image src={"/illustration-order-fail.svg"} alt={"Fail"} fill />
            ) : (
              <Image
                src={"/illustration-order-confirmed.svg"}
                alt={"Success"}
                fill
              />
            )}
          </div>
          {finishOrderMutation.isError ? (
            <>
              <DialogTitle className="mt-4 text-2xl text-destructive">
                Pedido falhou!
              </DialogTitle>
              <DialogDescription className="font-medium max-h-44 overflow-y-hidden">
                Seu pedido não pode ser efetuado. {finishOrderMutation.error.message}.
              </DialogDescription>
            </>
          ) : (
            <>
              <DialogTitle className="mt-4 text-2xl">
                Pedido efetuado!
              </DialogTitle>
              <DialogDescription className="font-medium">
                Seu pedido foi efetuado com sucesso. Você pode acompanhar o
                status na seção de “Meus Pedidos”.
              </DialogDescription>
            </>
          )}
          <DialogFooter>
            {!finishOrderMutation.isError && (
              <Button className="rounded-full" size="lg">
                <Link href={"/orders"}>Ver meus pedidos</Link>
              </Button>
            )}
            <Button
              className="rounded-full"
              variant="outline"
              size="lg"
              asChild
            >
              <Link href="/">Voltar para a loja</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FinishOrderButton;
