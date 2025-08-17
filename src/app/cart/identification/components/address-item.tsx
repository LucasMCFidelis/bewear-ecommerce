import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { Loader2, Pen, Trash } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  CreateShippingAddressSchema,
  createShippingAddressSchema,
} from "@/actions/create-shipping-address/schema";
import { UpdateDataShippingAddressSchema } from "@/actions/update-data-shipping-address/schema";
import { Button } from "@/components/ui/button";
import { shippingAddressTable } from "@/db/schema";
import { formatAddress } from "@/helpers/address";
import { useDeleteCartShippingAddress } from "@/hooks/mutations/use-delete-cart-shipping-address";
import { useUpdateDataShippingAddress } from "@/hooks/mutations/use-update-data-shipping-address";

import AddressForm from "./address-form";

interface AddressItemProps {
  address: typeof shippingAddressTable.$inferSelect;
  functionChangeSelectedAddress: Dispatch<SetStateAction<string | null>>;
}

const AddressItem = ({
  address,
  functionChangeSelectedAddress,
}: AddressItemProps) => {
  const [isOpenUpdateForm, setIsOpenUpdateForm] = useState<boolean>(false);
  const deleteCartShippingAddressMutation = useDeleteCartShippingAddress(
    address.id
  );
  const updateDataShippingAddressMutation = useUpdateDataShippingAddress(
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

  const formUpdateAddress = useForm<CreateShippingAddressSchema>({
    resolver: zodResolver(createShippingAddressSchema),
    defaultValues: {
      fullName: address.recipientName,
      cpf: address.cpfOrCnpj,
      address: address.street,
      ...address,
      complement: address.complement ?? "",
    },
  });

  const openUpdateForm = () => {
    setIsOpenUpdateForm(true);
  };
  const closeUpdateForm = () => {
    setIsOpenUpdateForm(false);
  };

  const handleUpdateShippingAddress = async (
    values: UpdateDataShippingAddressSchema
  ) => {
    try {
      await updateDataShippingAddressMutation.mutateAsync(values);
      functionChangeSelectedAddress(address.id);
      closeUpdateForm();
      toast.success("Endereço atualizado com sucesso");
    } catch (error) {
      toast.error("Erro ao atualizar endereço. Tente novamente");
      console.error(error);
    }
  };

  return (
    <>
      {isOpenUpdateForm ? (
        <>
          <AddressForm
            form={formUpdateAddress}
            onSubmit={formUpdateAddress.handleSubmit(
              handleUpdateShippingAddress
            )}
            className="w-full"
            isLoading={updateDataShippingAddressMutation.isPending}
          />
        </>
      ) : (
        <>
          <div className="flex-1">
            <Label htmlFor={address.id} className="cursor-pointer">
              <div>
                <p className="text-sm">{formatAddress({ address })}</p>
              </div>
            </Label>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
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
            <Button
              size={"icon"}
              variant={"outline"}
              onClick={() => openUpdateForm()}
            >
              <Pen />
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default AddressItem;
