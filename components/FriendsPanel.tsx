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
  className?: string;
};

export default function FriendsPanel({ friendships, className = "" }: Props) {
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
    <div className={`flex min-h-0 flex-col gap-3 ${className}`}>
      <details
        className="group shrink-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
        open={friends.length === 0}
      >
        <summary className="cursor-pointer list-none px-4 py-3.5 text-sm font-bold text-zinc-900 marker:content-none [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between gap-2">
            {t("community.social.friends.addTitle")}
            <span className="text-xs font-semibold text-blue-600 group-open:hidden">
              +
            </span>
          </span>
        </summary>
        <div className="border-t border-zinc-100 px-4 pb-4 pt-3">
          <p className="text-sm text-zinc-500">
            {t("community.social.friends.addHint")}
          </p>
          <form
            onSubmit={handleAddFriend}
            className="mt-3 flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t("community.social.friends.emailPlaceholder")}
              className="min-w-0 flex-1 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
              required
            />
            <button
              type="submit"
              disabled={pending}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {t("community.social.friends.addButton")}
            </button>
          </form>
          {error && (
            <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
          )}
        </div>
      </details>

      {incoming.length > 0 && (
        <PendingSection title={t("community.social.friends.incoming")}>
          {incoming.map((item) => (
            <FriendRow key={item.id} user={item.user}>
              <div className="flex shrink-0 gap-2">
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
        </PendingSection>
      )}

      {outgoing.length > 0 && (
        <PendingSection title={t("community.social.friends.outgoing")}>
          {outgoing.map((item) => (
            <FriendRow key={item.id} user={item.user}>
              <span className="shrink-0 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                {t("community.social.friends.pending")}
              </span>
            </FriendRow>
          ))}
        </PendingSection>
      )}

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="shrink-0 border-b border-zinc-100 px-4 py-3.5">
          <h2 className="text-base font-bold text-zinc-900">
            {t("community.social.friends.listTitle", { count: friends.length })}
          </h2>
        </div>

        {friends.length === 0 ? (
          <div className="flex flex-1 items-center justify-center px-6 py-12 text-center">
            <p className="text-sm text-zinc-500">
              {t("community.social.friends.empty")}
            </p>
          </div>
        ) : (
          <ul className="min-h-0 flex-1 divide-y divide-zinc-100 overflow-y-auto overscroll-contain">
            {friends.map((item) => (
              <li key={item.id}>
                <FriendRow user={item.user} fullWidth>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => handleChat(item.user.id)}
                      className="rounded-full bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-500"
                    >
                      {t("community.social.friends.message")}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      className="rounded-full border border-red-200 px-3.5 py-2 text-xs font-semibold text-red-600"
                    >
                      {t("community.social.friends.remove")}
                    </button>
                  </div>
                </FriendRow>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function PendingSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="shrink-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <h2 className="border-b border-zinc-100 px-4 py-3 text-sm font-bold text-zinc-900">
        {title}
      </h2>
      <div className="divide-y divide-zinc-100">{children}</div>
    </section>
  );
}

function FriendRow({
  user,
  children,
  fullWidth = false,
}: {
  user: FriendshipView["user"];
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 ${
        fullWidth
          ? "px-4 py-4"
          : "rounded-xl border border-zinc-100 bg-zinc-50/80 px-3 py-3"
      }`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
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
