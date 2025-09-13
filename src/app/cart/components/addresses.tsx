"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  CreateShippingAddressSchema,
  createShippingAddressSchema,
} from "@/actions/create-shipping-address/schema";
import { getManyShippingAddresses } from "@/app/data/shippingAddress/get-many-shipping-addresses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCreateShippingAddress } from "@/hooks/mutations/use-create-shipping-address";
import { useUpdateCartShippingAddress } from "@/hooks/mutations/use-update-cart-shipping-address";
import { useUserAddresses } from "@/hooks/queries/use-user-address";

import { useShippingAddressContext } from "../address-context";
import AddressForm from "./address-form";
import AddressItem from "./address-item";

interface AddressesProps {
  shippingAddresses: Awaited<ReturnType<typeof getManyShippingAddresses>>;
}

const Addresses = ({ shippingAddresses }: AddressesProps) => {
  const { selectedShippingAddress, setSelectedShippingAddress } =
    useShippingAddressContext();
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
      setSelectedShippingAddress(newAddress.id);
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

  const changeShippingAddress = async (newShippingAddress: string | null) => {
    if (!newShippingAddress) return;
    if (newShippingAddress === "add_new")
      return setSelectedShippingAddress(newShippingAddress);

    try {
      await updateCartShippingAddressMutation.mutateAsync({
        shippingAddressId: newShippingAddress,
      });
      setSelectedShippingAddress(newShippingAddress);
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
            value={selectedShippingAddress}
            onValueChange={(value) => changeShippingAddress(value)}
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
                    <AddressItem
                      key={address.id}
                      address={address}
                      functionChangeSelectedShippingAddress={
                        setSelectedShippingAddress
                      }
                    />
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

        {selectedShippingAddress === "add_new" && (
          <AddressForm
            form={form}
            isLoading={
              createShippingAddressMutation.isPending ||
              updateCartShippingAddressMutation.isPending
            }
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default Addresses;
