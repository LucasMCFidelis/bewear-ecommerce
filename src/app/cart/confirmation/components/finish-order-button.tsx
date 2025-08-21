"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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
  const {
    mutateAsync: finishOrderMutate,
    error: errorInFinishOrder,
    isError: isErrorFinishOrder,
    isPending: isPendingFinishOrder,
  } = useFinishOrder();
  const [isConfirmationDialogIsOpen, setIsConfirmationDialogIsOpen] =
    useState<boolean>(false);

  const handleFinishOrder = async () => {
    try {
      await finishOrderMutate();
    } catch (error) {
      console.log(error);
    }
    setIsConfirmationDialogIsOpen(true);
  };

  return (
    <>
      <Button
        className="w-full rounded-full"
        size="lg"
        onClick={handleFinishOrder}
        disabled={isPendingFinishOrder}
      >
        {isPendingFinishOrder ? (
          <>
            Finalizando sua compra
            <Loader2 className="h-5 w-5 animate-spin" />
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
            {isErrorFinishOrder ? (
              <Image src={"/illustration-order-fail.svg"} alt={"Fail"} fill />
            ) : (
              <Image
                src={"/illustration-order-confirmed.svg"}
                alt={"Success"}
                fill
              />
            )}
          </div>
          {isErrorFinishOrder ? (
            <>
              <DialogTitle className="mt-4 text-2xl text-destructive">
                Pedido falhou!
              </DialogTitle>
              <DialogDescription className="font-medium max-h-44 overflow-y-hidden">
                Seu pedido não pode ser efetuado. {errorInFinishOrder.message}.
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
            {!isErrorFinishOrder && (
              <Button className="rounded-full" size="lg">
                Ver meus pedidos
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
