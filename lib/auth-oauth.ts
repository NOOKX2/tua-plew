import { connectDB } from "@/lib/mongoose";
import { Account as AccountModel, User } from "@/lib/models";
import { grantWelcomeBonus } from "@/lib/rental-tokens";

export const OAUTH_PROVIDERS = ["google"] as const;
export type OAuthProviderId = (typeof OAUTH_PROVIDERS)[number];

export function isOAuthProvider(
  provider: string | undefined,
): provider is OAuthProviderId {
  return OAUTH_PROVIDERS.includes(provider as OAuthProviderId);
}

export function syntheticOAuthEmail(
  provider: OAuthProviderId,
  providerAccountId: string,
) {
  return `${provider}.${providerAccountId}@oauth.tuaplew.local`;
}

export function resolveOAuthEmail(input: {
  provider: OAuthProviderId;
  providerAccountId: string;
  email?: string | null;
}) {
  const normalized = input.email?.trim().toLowerCase();
  if (normalized) return normalized;
  return syntheticOAuthEmail(input.provider, input.providerAccountId);
}

export async function findUserIdByOAuthAccount(
  provider: OAuthProviderId,
  providerAccountId: string,
) {
  await connectDB();
  const account = await AccountModel.findOne({
    provider,
    providerAccountId,
  })
    .select("userId")
    .lean<{ userId: { toString(): string } }>();

  return account?.userId.toString();
}

export async function upsertOAuthUser(input: {
  provider: OAuthProviderId;
  providerAccountId: string;
  email: string;
  name?: string | null;
  image?: string | null;
  account: {
    type: string;
    refresh_token?: string | null;
    access_token?: string | null;
    expires_at?: number | null;
    token_type?: string | null;
    scope?: string | null;
    id_token?: string | null;
    session_state?: string | null;
  };
}) {
  await connectDB();

  let dbUser =
    (await User.findOne({ email: input.email })) ??
    (await (async () => {
      const userId = await findUserIdByOAuthAccount(
        input.provider,
        input.providerAccountId,
      );
      return userId ? User.findById(userId) : null;
    })());

  if (!dbUser) {
    dbUser = await User.create({
      name: input.name,
      email: input.email,
      image: input.image,
      emailVerified: new Date(),
      role: "user",
      rentalTokenBalance: 0,
    });
    await grantWelcomeBonus(dbUser._id.toString());
  } else {
    const updates: {
      name?: string;
      image?: string;
      emailVerified?: Date;
    } = {};

    if (input.name && !dbUser.name) updates.name = input.name;
    if (input.image && !dbUser.image) updates.image = input.image;
    if (!dbUser.emailVerified) updates.emailVerified = new Date();

    if (Object.keys(updates).length > 0) {
      await User.updateOne({ _id: dbUser._id }, { $set: updates });
    }
  }

  await AccountModel.findOneAndUpdate(
    {
      provider: input.provider,
      providerAccountId: input.providerAccountId,
    },
    {
      userId: dbUser._id,
      type: input.account.type,
      provider: input.provider,
      providerAccountId: input.providerAccountId,
      refresh_token: input.account.refresh_token,
      access_token: input.account.access_token,
      expires_at: input.account.expires_at,
      token_type: input.account.token_type,
      scope: input.account.scope,
      id_token: input.account.id_token,
      session_state: input.account.session_state,
    },
    { upsert: true },
  );

  return dbUser._id.toString();
}
