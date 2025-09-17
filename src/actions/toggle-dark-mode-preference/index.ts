"use server";

import { eq } from "drizzle-orm";

import { verifyUser } from "@/app/data/user/verify-user";
import { db } from "@/db";
import { userTable } from "@/db/schema";

export const toggleDarkModePreference = async () => {
  const user = await verifyUser();

  await db
    .update(userTable)
    .set({ preferenceDarkMode: !user.preferenceDarkMode })
    .where(eq(userTable.id, user.id));
};
