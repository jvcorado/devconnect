import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username?: string | null;
      avatar_url?: string | null;
      bio?: string | null;
    };
  }

  interface User {
    id: string;
    username?: string | null;
    avatar_url?: string | null;
  }
}
