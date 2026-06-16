"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import type { CommunityEvent } from "@/lib/types";
import { isEventFull, isEventJoinable } from "@/lib/community";
import {
  joinCommunityEventAction,
  leaveCommunityEventAction,
} from "@/lib/actions/community";
import { useTranslations } from "@/lib/i18n/client";

type Props = {
  event: CommunityEvent;
  initialJoined?: boolean;
  compact?: boolean;
  variant?: "default" | "premium";
  callbackUrl?: string;
  redirectOnJoin?: boolean;
  onJoined?: (participantCount: number) => void;
  onLeft?: (participantCount: number) => void;
};

export default function CommunityJoinButton({
  event,
  initialJoined = false,
  compact = false,
  variant = "default",
  callbackUrl,
  redirectOnJoin = true,
  onJoined,
  onLeft,
}: Props) {
  const t = useTranslations();
  const router = useRouter();
  const { status } = useSession();
  const [joined, setJoined] = useState(initialJoined);
  const [loading, setLoading] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setJoined(initialJoined);
  }, [initialJoined]);

  const joinable = isEventJoinable(event);
  const full = isEventFull(event);
  const loginHref = `/login?callbackUrl=${encodeURIComponent(
    callbackUrl ?? `/community/${event.id}`,
  )}`;

  const premium = variant === "premium" && !compact;

  const loginClass = premium
    ? "inline-flex w-full items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-wide text-zinc-950 transition-colors hover:bg-zinc-100"
    : compact
      ? "inline-flex rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
      : "inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 sm:w-auto";

  const joinedClass = premium
    ? "inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-400/20 px-8 py-4 text-sm font-bold text-emerald-200 ring-1 ring-emerald-400/30"
    : compact
      ? "inline-flex w-full items-center justify-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200"
      : "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 px-6 py-3.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 sm:w-auto";

  const leaveClass = premium
    ? "inline-flex w-full items-center justify-center rounded-full border border-red-400/40 bg-red-500/10 px-8 py-3.5 text-sm font-semibold text-red-200 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
    : compact
      ? "inline-flex w-full items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
      : "inline-flex w-full items-center justify-center rounded-xl border border-red-200 bg-red-50 px-6 py-3 text-sm font-semibold text-red-700 transition-colors hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto";

  const buttonClass = premium
    ? "inline-flex w-full items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-wide text-zinc-950 transition-all hover:bg-zinc-100 disabled:cursor-not-allowed disabled:bg-zinc-600 disabled:text-zinc-300"
    : compact
      ? "inline-flex rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      : "inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto";

  async function handleJoin() {
    setError(null);
    setLoading(true);

    const result = await joinCommunityEventAction(event.id);

    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setJoined(true);
    onJoined?.(result.data.participantCount);
    if (redirectOnJoin) {
      router.push(`/community/${event.id}/welcome`);
      return;
    }
    router.refresh();
  }

  async function handleLeave() {
    setError(null);
    setLeaving(true);

    const result = await leaveCommunityEventAction(event.id);

    setLeaving(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setJoined(false);
    onLeft?.(result.data.participantCount);
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
        className={loginClass}
      >
        {t("community.loginToJoin")}
      </Link>
    );
  }

  if (joined) {
    return (
      <div className={compact ? "space-y-2" : "space-y-2"}>
        <div className={compact ? "space-y-2" : "space-y-2"}>
          <Link
            href={`/community/${event.id}/welcome`}
            onClick={compact ? (e) => e.stopPropagation() : undefined}
            className={joinedClass}
          >
            <span aria-hidden>✓</span>
            {compact ? t("community.viewPerks") : t("community.viewPerks")}
          </Link>
          <button
            type="button"
            disabled={leaving}
            onClick={(e) => {
              if (compact) e.stopPropagation();
              handleLeave();
            }}
            className={leaveClass}
          >
            {leaving ? t("community.leaving") : t("community.leave")}
          </button>
        </div>
        {error && (
          <p className={`text-xs text-red-600 ${compact ? "mt-1" : ""}`}>
            {error}
          </p>
        )}
      </div>
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
        className={buttonClass}
      >
        {label}
      </button>
      {error && (
        <p className={`text-xs text-red-600 ${compact ? "mt-1" : ""}`}>{error}</p>
      )}
    </div>
  );
}
