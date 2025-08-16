import { Label } from "@radix-ui/react-label";
import { Loader2, Trash } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { shippingAddressTable } from "@/db/schema";
import { formatAddress } from "@/helpers/address";
import { useDeleteCartShippingAddress } from "@/hooks/mutations/use-delete-cart-shipping-address";

interface AddressItemProps {
  address: typeof shippingAddressTable.$inferSelect;
  functionChangeSelectedAddress: Dispatch<SetStateAction<string | null>>;
}

const AddressItem = ({
  address,
  functionChangeSelectedAddress,
}: AddressItemProps) => {
  const deleteCartShippingAddressMutation = useDeleteCartShippingAddress(
    address.id
  );

  const handleDeleteShippingAddress = async () => {
    try {
      await deleteCartShippingAddressMutation.mutateAsync();
      functionChangeSelectedAddress(null);
      toast.success("Endereço deletado com sucesso");
    } catch (error) {
      toast.error("Erro ao deletar endereço. Tente novamente");
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex-1">
        <Label htmlFor={address.id} className="cursor-pointer">
          <div>
            <p className="text-sm">{formatAddress({ address })}</p>
          </div>
        </Label>
      </div>
      <Button
        key={address.id}
        size={"icon"}
        variant={"outline"}
        disabled={deleteCartShippingAddressMutation.isPending}
        onClick={() => handleDeleteShippingAddress()}
      >
        {deleteCartShippingAddressMutation.isPending ? (
          <>
            <Loader2 className="mr-1 animate-spin" />
          </>
        ) : (
          <Trash />
        )}
      </Button>
    </>
  );
};

export default AddressItem;
