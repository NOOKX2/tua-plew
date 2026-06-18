import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { connectDB } from "@/lib/mongoose";
import { User } from "@/lib/models";
import { verifyPassword } from "@/lib/password";
import type { UserRole } from "@/lib/types";
import { resolveUserRole } from "@/lib/user-role.server";
import {
  isOAuthProvider,
  resolveOAuthEmail,
  upsertOAuthUser,
} from "@/lib/auth-oauth";
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

if (
  process.env.NODE_ENV === "production" &&
  /localhost|127\.0\.0\.1/.test(process.env.AUTH_URL ?? "")
) {
  delete process.env.AUTH_URL;
}

const providers = [
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
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  providers,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!isOAuthProvider(account?.provider) || !account.providerAccountId) {
        return true;
      }

      const email = resolveOAuthEmail({
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        email: user.email,
      });

      await upsertOAuthUser({
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        email,
        name: user.name,
        image: user.image,
        account,
      });

      return true;
    },
    async jwt({ token, user, account, profile }) {
      if (isOAuthProvider(account?.provider) && account.providerAccountId) {
        const email = resolveOAuthEmail({
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          email:
            typeof profile?.email === "string"
              ? profile.email
              : user?.email?.toLowerCase(),
        });

        await connectDB();
        const dbUser = await User.findOne({ email });
        if (dbUser) token.sub = dbUser._id.toString();
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
