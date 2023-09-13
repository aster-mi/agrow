import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { JWT } from "next-auth/jwt";

const prisma = new PrismaClient();

type ClientType = {
  clientId: string;
  clientSecret: string;
};

export const nextAuthOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    } as ClientType),
  ],
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      // jwtが呼ばれた後に実行されます．
      if (session?.user) {
        session.user.id = token.id;
        session.user.publicId = token.publicId;
      }
      return session; // JWTではuserは渡されません
    },
    async jwt({ token, user }: { token: JWT; user: User }) {
      // authorize関数でオリジナル変数をuserにセットした場合，ここでtokenにその値を写す必要があります．
      if (user) {
        token.id = user.id;
        token.publicId = user.publicId;
      }
      return token; // 初回の認証以降，tokenしか渡されません．
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };
