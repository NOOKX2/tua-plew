import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { connectDB } from "@/lib/mongoose";
import { Account, User } from "@/lib/models";
import { verifyPassword } from "@/lib/password";
import type { UserRole } from "@/lib/types";
import { resolveUserRole } from "@/lib/user-role.server";
import { grantWelcomeBonus } from "@/lib/rental-tokens";
import { isMongoObjectId } from "@/lib/users.server";

async function syncSessionUserFromDb(
  sessionUser: { id?: string; email?: string | null; role?: UserRole },
  tokenSub?: string,
  tokenRole?: UserRole,
) {
  if (tokenSub && isMongoObjectId(tokenSub)) {
    sessionUser.id = tokenSub;
  } else if (sessionUser.email) {
    await connectDB();
    const dbUser = await User.findOne({
      email: sessionUser.email.toLowerCase(),
    })
      .select("_id")
      .lean<{ _id: { toString(): string } }>();
    if (dbUser) sessionUser.id = dbUser._id.toString();
  }

  sessionUser.role = tokenRole === "admin" ? "admin" : "user";
}

// Vercel/production must not use a localhost AUTH_URL — it breaks OAuth redirect_uri
// and can make sign-in appear to "bounce" away from /login.
if (
  process.env.NODE_ENV === "production" &&
  /localhost|127\.0\.0\.1/.test(process.env.AUTH_URL ?? "")
) {
  delete process.env.AUTH_URL;
}

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
          role: user.role === "admin" ? "admin" : "user",
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
          role: "user",
          rentalTokenBalance: 0,
        });
        await grantWelcomeBonus(dbUser._id.toString());
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
      if (account?.provider === "google") {
        const email =
          typeof profile?.email === "string"
            ? profile.email.toLowerCase()
            : user?.email?.toLowerCase();

        if (email) {
          await connectDB();
          const dbUser = await User.findOne({ email });
          if (dbUser) token.sub = dbUser._id.toString();
        }
      } else if (user?.id) {
        token.sub = user.id;
        token.role = user.role === "admin" ? "admin" : "user";
      } else if (
        typeof token.sub === "string" &&
        !isMongoObjectId(token.sub) &&
        typeof token.email === "string"
      ) {
        await connectDB();
        const dbUser = await User.findOne({
          email: token.email.toLowerCase(),
        });
        if (dbUser) token.sub = dbUser._id.toString();
      }

      if (typeof token.sub === "string" && isMongoObjectId(token.sub)) {
        token.role = await resolveUserRole(token.sub, token.email);
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        await syncSessionUserFromDb(
          session.user,
          token.sub,
          token.role === "admin" ? "admin" : "user",
        );
      }
      return session;
    },
  },
  trustHost: true,
});

export const { GET, POST } = handlers;
