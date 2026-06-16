"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { FriendshipView } from "@/lib/types";
import {
  acceptFriendRequestAction,
  declineFriendRequestAction,
  removeFriendAction,
  sendFriendRequestByEmailAction,
  startDirectChatAction,
} from "@/lib/actions/friends";
import { useTranslations } from "@/lib/i18n/client";
import { UserAvatar } from "./CommunitySocialNav";

type Props = {
  friendships: FriendshipView[];
};

export default function FriendsPanel({ friendships }: Props) {
  const t = useTranslations();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const incoming = friendships.filter(
    (item) => item.direction === "incoming" && item.status === "pending",
  );
  const outgoing = friendships.filter(
    (item) => item.direction === "outgoing" && item.status === "pending",
  );
  const friends = friendships.filter((item) => item.status === "accepted");

  function refresh() {
    startTransition(() => router.refresh());
  }

  async function handleAddFriend(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    const result = await sendFriendRequestByEmailAction(email);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setEmail("");
    refresh();
  }

  async function handleAccept(friendshipId: string) {
    const result = await acceptFriendRequestAction(friendshipId);
    if (!result.ok) setError(result.error);
    else refresh();
  }

  async function handleDecline(friendshipId: string) {
    const result = await declineFriendRequestAction(friendshipId);
    if (!result.ok) setError(result.error);
    else refresh();
  }

  async function handleRemove(friendshipId: string) {
    const result = await removeFriendAction(friendshipId);
    if (!result.ok) setError(result.error);
    else refresh();
  }

  async function handleChat(friendUserId: string) {
    const result = await startDirectChatAction(friendUserId);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push(`/community/messages/${result.data.conversationId}`);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-zinc-900">
          {t("community.social.friends.addTitle")}
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          {t("community.social.friends.addHint")}
        </p>
        <form onSubmit={handleAddFriend} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t("community.social.friends.emailPlaceholder")}
            className="min-w-0 flex-1 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-400"
            required
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {t("community.social.friends.addButton")}
          </button>
        </form>
        {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
      </section>

      {incoming.length > 0 && (
        <FriendSection title={t("community.social.friends.incoming")}>
          {incoming.map((item) => (
            <FriendRow key={item.id} user={item.user}>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleAccept(item.id)}
                  className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  {t("community.social.friends.accept")}
                </button>
                <button
                  type="button"
                  onClick={() => handleDecline(item.id)}
                  className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-600"
                >
                  {t("community.social.friends.decline")}
                </button>
              </div>
            </FriendRow>
          ))}
        </FriendSection>
      )}

      {outgoing.length > 0 && (
        <FriendSection title={t("community.social.friends.outgoing")}>
          {outgoing.map((item) => (
            <FriendRow key={item.id} user={item.user}>
              <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                {t("community.social.friends.pending")}
              </span>
            </FriendRow>
          ))}
        </FriendSection>
      )}

      <FriendSection title={t("community.social.friends.listTitle", { count: friends.length })}>
        {friends.length === 0 ? (
          <p className="text-sm text-zinc-500">
            {t("community.social.friends.empty")}
          </p>
        ) : (
          friends.map((item) => (
            <FriendRow key={item.id} user={item.user}>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleChat(item.user.id)}
                  className="rounded-full bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  {t("community.social.friends.message")}
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600"
                >
                  {t("community.social.friends.remove")}
                </button>
              </div>
            </FriendRow>
          ))
        )}
      </FriendSection>
    </div>
  );
}

function FriendSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-bold text-zinc-900">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function FriendRow({
  user,
  children,
}: {
  user: FriendshipView["user"];
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-zinc-100 bg-zinc-50/80 px-3 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <UserAvatar name={user.name} image={user.image} size="sm" />
        <div className="min-w-0">
          <p className="truncate font-semibold text-zinc-900">{user.name}</p>
          <p className="truncate text-xs text-zinc-500">{user.email}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
