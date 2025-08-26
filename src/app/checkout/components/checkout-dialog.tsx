"use client"

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

interface CheckoutDialogProps {
  imageUrl: string;
  imageAlt: string;
  dialogTitle: string;
  dialogDescription?: string;
  dialogComplementAction?: React.ReactNode;
}

const CheckoutDialog = ({
  imageUrl,
  imageAlt,
  dialogTitle,
  dialogDescription,
  dialogComplementAction,
}: CheckoutDialogProps) => {
  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="text-center ">
        <div className="relative w-full h-auto aspect-square">
          <Image src={imageUrl} alt={imageAlt} fill />
        </div>

        <DialogTitle className="mt-4 text-2xl">
          {dialogTitle}
        </DialogTitle>
        {dialogDescription && (
          <DialogDescription className="font-medium max-h-44 overflow-y-hidden">
            {dialogDescription}
          </DialogDescription>
        )}

        <DialogFooter>
          {dialogComplementAction && dialogComplementAction}
          <Button className="rounded-full" variant="outline" size="lg" asChild>
            <Link href="/">Voltar para a loja</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
