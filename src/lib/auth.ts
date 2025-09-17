import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession } from "better-auth/plugins";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { userTable } from "@/db/schema";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  plugins: [
    customSession(async ({ user, session }) => {
      const userCustom = await db.query.userTable.findFirst({
        where: eq(userTable.id, user.id),
      });
      return {
        user: {
          ...user,
          preferenceDarkMode: userCustom
            ? userCustom.preferenceDarkMode
            : false,
        },
        session,
      };
    }),
  ],
  user: {
    modelName: "userTable",
    additionalFields: {
      preferenceDarkMode: {
        type: "boolean",
      },
    },
  },
  session: {
    modelName: "sessionTable",
  },
  account: {
    modelName: "accountTable",
  },
  verification: {
    modelName: "verificationTable",
  },
});
