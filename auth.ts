import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { connectDB } from "@/lib/mongoose";
import { Account, User } from "@/lib/models";
import { verifyPassword } from "@/lib/password";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Google,
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email.trim().toLowerCase()
            : "";
        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : "";

        if (!email || !password) return null;

        await connectDB();
        const user = await User.findOne({ email });
        if (!user?.passwordHash) return null;

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google" || !user.email) return true;

      await connectDB();
      const email = user.email.toLowerCase();
      let dbUser = await User.findOne({ email });

      if (!dbUser) {
        dbUser = await User.create({
          name: user.name,
          email,
          image: user.image,
          emailVerified: new Date(),
        });
      }

      await Account.findOneAndUpdate(
        {
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        },
        {
          userId: dbUser._id,
          type: account.type,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: account.session_state,
        },
        { upsert: true },
      );

      return true;
    },
    async jwt({ token, user, account, profile }) {
      if (user?.id) {
        token.sub = user.id;
      } else if (account?.provider === "google") {
        const email =
          typeof profile?.email === "string"
            ? profile.email.toLowerCase()
            : user?.email?.toLowerCase();

        if (email) {
          await connectDB();
          const dbUser = await User.findOne({ email });
          if (dbUser) token.sub = dbUser._id.toString();
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  trustHost: true,
});
