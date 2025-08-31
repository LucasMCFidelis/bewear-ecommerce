import "server-only";

import { cache } from "react";

import { verifyUser } from "./user/verify-user";

export const canSeePrivacyAtribute = cache(async (userId: string) => {
  const user = await verifyUser();
  return userId === user.id;
});
