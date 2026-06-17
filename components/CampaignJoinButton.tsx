"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Campaign } from "@/lib/types";
import { isCampaignActive, isCampaignUpcoming } from "@/lib/campaigns";
import { joinCampaignAction } from "@/lib/actions/campaigns";
import { useTranslations } from "@/lib/i18n/client";

type Props = {
  campaign: Campaign;
  initialJoined?: boolean;
  compact?: boolean;
  variant?: "default" | "premium";
  callbackUrl?: string;
  isAuthenticated?: boolean;
};

export default function CampaignJoinButton({
  campaign,
  initialJoined = false,
  compact = false,
  variant = "default",
  callbackUrl,
  isAuthenticated = false,
}: Props) {
  const t = useTranslations();
  const router = useRouter();
  const [joined, setJoined] = useState(initialJoined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const active = isCampaignActive(campaign);
  const upcoming = isCampaignUpcoming(campaign);
  const loginHref = `/login?callbackUrl=${encodeURIComponent(
    callbackUrl ?? `/campaigns/${campaign.id}`,
  )}`;

  const premium = variant === "premium" && !compact;

  const loginClass = premium
    ? "inline-flex w-full items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-wide text-zinc-950 transition-colors hover:bg-zinc-100"
    : compact
      ? "inline-flex rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-amber-600"
      : "inline-flex w-full items-center justify-center rounded-xl bg-amber-500 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600 sm:w-auto";

  const joinedClass = premium
    ? "inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-400/20 px-8 py-4 text-sm font-bold text-amber-200 ring-1 ring-amber-400/30"
    : compact
      ? "inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-200"
      : "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-50 px-6 py-3.5 text-sm font-semibold text-blue-700 ring-1 ring-blue-200 sm:w-auto";

  const buttonClass = premium
    ? "inline-flex w-full items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-wide text-zinc-950 transition-all hover:bg-zinc-100 disabled:cursor-not-allowed disabled:bg-zinc-600 disabled:text-zinc-300"
    : compact
      ? "inline-flex rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
      : "inline-flex w-full items-center justify-center rounded-xl bg-amber-500 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto";

  async function handleJoin() {
    setError(null);
    setLoading(true);

    const result = await joinCampaignAction(campaign.id);

    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setJoined(true);
    router.refresh();
  }

  if (!isAuthenticated) {
    return (
      <Link
        href={loginHref}
        onClick={compact ? (e) => e.stopPropagation() : undefined}
        className={loginClass}
      >
        {t("campaign.loginToJoin")}
      </Link>
    );
  }

  if (joined) {
    return (
      <div className={compact ? "" : "space-y-2"}>
        <span className={joinedClass}>
          <span aria-hidden>✓</span>
          {t("campaign.joined")}
        </span>
      </div>
    );
  }

  const disabled = !active;
  const label = loading
    ? t("campaign.joining")
    : upcoming
      ? t("campaign.errors.notStarted")
      : !active
        ? t("campaign.errors.ended")
        : t("campaign.join");

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
