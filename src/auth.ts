import NextAuth, { NextAuthOptions, Session, User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

/**
 * @see https://github.com/vercel/next.js/issues/56832
 */
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user }) {
      // [WIP]: connect DB;
      user;
      return true;
    },
    /**
     * @param {user} User データベースセッションを使う場合に渡される
     * @param {token} JWT jwtを使う場合に渡される
     */
    async session({ session, user, token }) {
      session.user.id = token.id; // TODO: ログ確認用。あとで消す。
      console.log('session\n', new Date().toLocaleString('ja-JA', { timeZone: 'UTC' }), session);
      return { ...session, id: token.id };
    },
    // async jwt({ token, user }) {
    //   console.log('token\n', new Date().toLocaleString('ja-JA', { timeZone: 'UTC' }), token);
    //   if (user) {
    //     token.id = user.id;
    //   }
    //   return token;
    // },
  },
};

export const handler = NextAuth(authOptions);