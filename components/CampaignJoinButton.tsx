"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import type { Campaign } from "@/lib/types";
import { isCampaignActive, isCampaignUpcoming } from "@/lib/campaigns";
import { useTranslations } from "@/lib/i18n/client";

type Props = {
  campaign: Campaign;
  initialJoined?: boolean;
  compact?: boolean;
  callbackUrl?: string;
};

export default function CampaignJoinButton({
  campaign,
  initialJoined = false,
  compact = false,
  callbackUrl,
}: Props) {
  const t = useTranslations();
  const router = useRouter();
  const { status } = useSession();
  const [joined, setJoined] = useState(initialJoined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const active = isCampaignActive(campaign);
  const upcoming = isCampaignUpcoming(campaign);
  const loginHref = `/login?callbackUrl=${encodeURIComponent(
    callbackUrl ?? `/campaigns/${campaign.id}`,
  )}`;

  async function handleJoin() {
    setError(null);
    setLoading(true);

    const response = await fetch(`/api/campaigns/${campaign.id}/join`, {
      method: "POST",
    });
    const data = (await response.json()) as { error?: string };

    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? t("campaign.errors.joinFailed"));
      return;
    }

    setJoined(true);
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
            ? "inline-flex rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-amber-600"
            : "inline-flex w-full items-center justify-center rounded-xl bg-amber-500 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600 sm:w-auto"
        }
      >
        {t("campaign.loginToJoin")}
      </Link>
    );
  }

  if (joined) {
    return (
      <div className={compact ? "" : "space-y-2"}>
        <span
          className={
            compact
              ? "inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200"
              : "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 px-6 py-3.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 sm:w-auto"
          }
        >
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
        className={
          compact
            ? "inline-flex rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
            : "inline-flex w-full items-center justify-center rounded-xl bg-amber-500 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
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
