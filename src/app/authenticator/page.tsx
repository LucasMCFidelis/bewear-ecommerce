"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mountCallbackUrl } from "@/helpers/mount-callback-url";

import SignInForm from "./components/sign-in-form";
import SignUpForm from "./components/sign-up-form";

const Authenticator = () => {
  return (
    <Suspense fallback={<p>Carregando página de autenticação...</p>}>
      <AuthenticatorContent />
    </Suspense>
  );
};

const AuthenticatorContent = () => {
  const searchParams = useSearchParams();

  let callbackURLWithStates;
  if (searchParams) {
    callbackURLWithStates = mountCallbackUrl({
      baseUrl: searchParams.get("callbackUrl") || "",
      states: [
        ...searchParams.entries().map(([key, value]) => ({
          name: key,
          value,
        })),
      ],
    });
  }

  return (
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
  );
};

export default Authenticator;
