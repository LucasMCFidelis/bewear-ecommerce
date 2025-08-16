"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  CreateShippingAddressSchema,
  createShippingAddressSchema,
} from "@/actions/create-shipping-address/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { shippingAddressTable } from "@/db/schema";
import { useCreateShippingAddress } from "@/hooks/mutations/use-create-shipping-address";
import { useUpdateCartShippingAddress } from "@/hooks/mutations/use-update-cart-shipping-address";
import { useUserAddresses } from "@/hooks/queries/use-user-address";

import AddressForm from "./address-form";
import AddressItem from "./address-item";

interface AddressesProps {
  shippingAddresses: (typeof shippingAddressTable.$inferSelect)[];
  defaultShippingAddressId: string | null;
}

const Addresses = ({
  shippingAddresses,
  defaultShippingAddressId,
}: AddressesProps) => {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(
    defaultShippingAddressId || null
  );
  const createShippingAddressMutation = useCreateShippingAddress();
  const { data: addresses, isPending: isAddressesPending } = useUserAddresses({
    initialData: shippingAddresses,
  });
  const updateCartShippingAddressMutation = useUpdateCartShippingAddress();

  const form = useForm<CreateShippingAddressSchema>({
    resolver: zodResolver(createShippingAddressSchema),
    defaultValues: {
      email: "",
      fullName: "",
      cpf: "",
      phone: "",
      zipCode: "",
      address: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  });

  const onSubmit = async (values: CreateShippingAddressSchema) => {
    try {
      const newAddress =
        await createShippingAddressMutation.mutateAsync(values);
      setSelectedAddress(newAddress.id);
      toast.success("Endereço criado com sucesso!");
      form.reset();

      await updateCartShippingAddressMutation.mutateAsync({
        shippingAddressId: newAddress.id,
      });
      toast.success("Endereço vinculado ao carrinho!");
    } catch (error) {
      toast.error("Erro ao criar endereço. Tente novamente.");
      console.error(error);
    }
  };

  const handleGoToPayment = async () => {
    if (!selectedAddress || selectedAddress === "add_new") return;

    try {
      await updateCartShippingAddressMutation.mutateAsync({
        shippingAddressId: selectedAddress,
      });
      toast.success("Endereço selecionado para entrega!");
    } catch (error) {
      toast.error("Erro ao selecionar endereço. Tente novamente.");
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identificação</CardTitle>
      </CardHeader>
      <CardContent>
        {isAddressesPending ? (
          <p className="text-sm">Carregando endereços</p>
        ) : (
          <RadioGroup
            value={selectedAddress}
            onValueChange={setSelectedAddress}
          >
            {addresses?.length === 0 && (
              <div className="py-4 text-center">
                <p className="text-muted-foreground">
                  Você ainda não possui endereços cadastrados.
                </p>
              </div>
            )}

            {addresses?.map((address) => (
              <Card key={address.id}>
                <CardContent>
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value={address.id} id={address.id} />
                    <AddressItem key={address.id} address={address} functionChangeSelectedAddress={setSelectedAddress} />
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="add_new" id="add_new" />
                  <Label htmlFor="add_new">Adicionar novo endereço</Label>
                </div>
              </CardContent>
            </Card>
          </RadioGroup>
        )}

        {selectedAddress && selectedAddress !== "add_new" && (
          <div className="mt-4">
            <Button
              onClick={handleGoToPayment}
              className="w-full"
              disabled={updateCartShippingAddressMutation.isPending}
            >
              {updateCartShippingAddressMutation.isPending
                ? "Processando..."
                : "Ir para pagamento"}
            </Button>
          </div>
        )}

        {selectedAddress === "add_new" && (
          <AddressForm
            form={form}
            isLoading={
              createShippingAddressMutation.isPending ||
              updateCartShippingAddressMutation.isPending
            }
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default Addresses;
