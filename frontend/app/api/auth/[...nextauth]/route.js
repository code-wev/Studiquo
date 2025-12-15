import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        if (!credentials) return null;
        // If the client already authenticated against your backend and
        // passes user info to signIn('credentials', { ...user }), just
        // return that object so NextAuth can create a session.
        return {
          id: credentials._id || credentials.id || credentials.email,
          email: credentials.email,
          role: credentials.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.role) {
        session.user = { ...session.user, role: token.role };
      }
      return session;
    },
  },
};

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
