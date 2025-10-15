"use client";

import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mountCallbackUrl } from "@/helpers/mount-callback-url";

import SignInForm from "./components/sign-in-form";
import SignUpForm from "./components/sign-up-form";

const Authenticator = () => {
  const [{ callbackUrl, quantity }] = useQueryStates({
    callbackUrl: parseAsString,
    quantity: parseAsInteger.withDefault(1),
  });
  const callbackURLWithStates = mountCallbackUrl({
    baseUrl: callbackUrl || "",
    states: [{ name: "quantity", value: quantity }],
  });

  return (
    <>
      <div className="flex w-full flex-col gap-6 p-5">
        <Tabs defaultValue="sign-in">
          <TabsList>
            <TabsTrigger value="sign-in">Entrar</TabsTrigger>
            <TabsTrigger value="sign-up">Criar conta</TabsTrigger>
          </TabsList>
          <TabsContent value="sign-in" className="w-full">
            <SignInForm callbackUrl={callbackURLWithStates} />
          </TabsContent>
          <TabsContent value="sign-up" className="w-full">
            <SignUpForm callbackUrl={callbackURLWithStates} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Authenticator;
