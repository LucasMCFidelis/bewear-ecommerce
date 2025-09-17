import "server-only";

import { headers } from "next/headers";
import { cache } from "react";

import { auth } from "@/lib/auth";

import { UserDTO } from "./user-dto";

export const verifyUser = cache(async (): Promise<UserDTO> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    preferenceDarkMode: !!session.user.preferenceDarkMode
  };
});
