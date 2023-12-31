import { prisma } from '@/lib/prismaClient';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { getServerSession as defaultGetServerSession, type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { revalidateTag } from 'next/cache';

/**
 * @see https://github.com/vercel/next.js/issues/56832
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn() {
      revalidateTag('users');
      return true;
    },
    /**
     * @param {user} User データベースセッションを使う場合に渡される
     * @param {token} JWT jwtを使う場合に渡される
     */
    async session({ session, user, token }) {
      session.user.id = token.sub ?? ''; // TODO: ログ確認用。あとで消す。
      // console.log('session\n', new Date().toLocaleString('ja-JA', { timeZone: 'UTC' }), session);
      return session;
    },
    // async jwt({ token, user }) {
    //   console.log('token\n', new Date().toLocaleString('ja-JA', { timeZone: 'UTC' }), token);
    //   // if (user) {
    //   //   token.id = user.id;
    //   // }
    //   return token;
    // },
  },
};

export const getServerSession = async (
  ...args: [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']] | [NextApiRequest, NextApiResponse] | []
) => {
  return await defaultGetServerSession(...args, authOptions);
};

export const handler = NextAuth(authOptions);
