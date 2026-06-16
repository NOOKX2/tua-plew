"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { EventParticipant } from "@/lib/types";
import {
  sendFriendRequestToUserAction,
  startDirectChatAction,
} from "@/lib/actions/friends";
import { useTranslations } from "@/lib/i18n/client";
import { UserAvatar } from "./CommunitySocialNav";

type Props = {
  participants: EventParticipant[];
  currentUserId?: string | null;
  showSelf?: boolean;
};

export default function EventParticipantsPanel({
  participants,
  currentUserId = null,
  showSelf = false,
}: Props) {
  const t = useTranslations();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const visible = showSelf
    ? participants
    : participants.filter((p) => p.id !== currentUserId);

  async function handleAddFriend(userId: string) {
    setError(null);
    const result = await sendFriendRequestToUserAction(userId);
    if (!result.ok) setError(result.error);
    else router.refresh();
  }

  async function handleMessage(userId: string) {
    setError(null);
    const result = await startDirectChatAction(userId);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push(`/community/messages/${result.data.conversationId}`);
  }

  if (visible.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        {t("community.social.participants.empty")}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
      {visible.map((participant) => {
        const isSelf = participant.id === currentUserId;

        return (
          <div
            key={participant.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-zinc-100 bg-zinc-50/80 px-3 py-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <UserAvatar
                name={participant.name}
                image={participant.image}
                size="sm"
              />
              <div className="min-w-0">
                <p className="truncate font-semibold text-zinc-900">
                  {participant.name}
                  {isSelf && (
                    <span className="ml-2 text-xs font-medium text-blue-600">
                      ({t("community.participants.you")})
                    </span>
                  )}
                </p>
                {!isSelf && participant.isFriend && (
                  <p className="text-xs font-medium text-blue-600">
                    {t("community.social.participants.friend")}
                  </p>
                )}
              </div>
            </div>

            {!isSelf && currentUserId && (
              <div className="flex shrink-0 gap-2">
                {participant.isFriend ? (
                  <button
                    type="button"
                    onClick={() => handleMessage(participant.id)}
                    className="rounded-full bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    {t("community.social.friends.message")}
                  </button>
                ) : participant.friendshipStatus === "pending" ? (
                  <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                    {t("community.social.friends.pending")}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleAddFriend(participant.id)}
                    className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                  >
                    {t("community.social.participants.addFriend")}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
