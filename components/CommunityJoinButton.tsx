"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import type { CommunityEvent } from "@/lib/types";
import { isEventFull, isEventJoinable } from "@/lib/community";
import { useTranslations } from "@/lib/i18n/client";

type Props = {
  event: CommunityEvent;
  initialJoined?: boolean;
  compact?: boolean;
  callbackUrl?: string;
  onJoined?: (participantCount: number) => void;
};

export default function CommunityJoinButton({
  event,
  initialJoined = false,
  compact = false,
  callbackUrl,
  onJoined,
}: Props) {
  const t = useTranslations();
  const router = useRouter();
  const { status } = useSession();
  const [joined, setJoined] = useState(initialJoined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinable = isEventJoinable(event);
  const full = isEventFull(event);
  const loginHref = `/login?callbackUrl=${encodeURIComponent(
    callbackUrl ?? `/community/${event.id}`,
  )}`;

  async function handleJoin() {
    setError(null);
    setLoading(true);

    const response = await fetch(`/api/community/${event.id}/join`, {
      method: "POST",
    });
    const data = (await response.json()) as {
      error?: string;
      participantCount?: number;
    };

    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? t("community.errors.joinFailed"));
      return;
    }

    setJoined(true);
    if (typeof data.participantCount === "number") {
      onJoined?.(data.participantCount);
    }
    router.refresh();
  }

  if (status === "loading") {
    return (
      <span className={`text-xs text-zinc-400 ${compact ? "" : "block"}`}>
        {t("common.loading")}
      </span>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Link
        href={loginHref}
        onClick={compact ? (e) => e.stopPropagation() : undefined}
        className={
          compact
            ? "inline-flex rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
            : "inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 sm:w-auto"
        }
      >
        {t("community.loginToJoin")}
      </Link>
    );
  }

  if (joined) {
    return (
      <span
        className={
          compact
            ? "inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200"
            : "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 px-6 py-3.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 sm:w-auto"
        }
      >
        <span aria-hidden>✓</span>
        {t("community.joined")}
      </span>
    );
  }

  const disabled = !joinable || full;
  const label = loading
    ? t("community.joining")
    : full
      ? t("community.errors.full")
      : !joinable
        ? t("community.errors.ended")
        : t("community.join");

  return (
    <div className={compact ? "" : "space-y-2"}>
      <button
        type="button"
        disabled={disabled || loading}
        onClick={(e) => {
          if (compact) e.stopPropagation();
          handleJoin();
        }}
        className={
          compact
            ? "inline-flex rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            : "inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        }
      >
        {label}
      </button>
      {error && (
        <p className={`text-xs text-red-600 ${compact ? "mt-1" : ""}`}>{error}</p>
      )}
    </div>
  );
}
