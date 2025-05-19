import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/prisma";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  debug: true,
  callbacks: {
    async session({ session, user }) {
      const dbUser = await db.user.findUnique({
        where: { id: user.id },
      });

      if (!dbUser) return session;

      return {
        ...session,
        user: {
          ...session.user,
          id: dbUser.id,
          username: dbUser.username,
          avatar_url: dbUser.avatar_url,
        },
      };
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
};
