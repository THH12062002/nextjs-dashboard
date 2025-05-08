import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { users } from "@/app/lib/placeholder-data";

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = users.find((user) => user.email === email);

          if (!user) return null;

          // Compare plain text password since we're using placeholder data
          if (password === user.password) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
            };
          }
        }
        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
