"use client";

import { useSearchParams } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mountCallbackUrl } from "@/helpers/mount-callback-url";

import SignInForm from "./components/sign-in-form";
import SignUpForm from "./components/sign-up-form";

const Authenticator = () => {
  const searchParams = useSearchParams();

  const callbackURLWithStates = mountCallbackUrl({
    baseUrl: searchParams.get("callbackUrl") || "",
    states: [
      ...(searchParams.entries().map((item)=>{
        return { name: item[0], value: item[1]}
      })), 
    ],
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
