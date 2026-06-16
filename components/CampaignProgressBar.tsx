"use client";

import type { CampaignProgress } from "@/lib/types";
import { useTranslations } from "@/lib/i18n/client";

type Props = {
  progress: CampaignProgress;
  variant?: "default" | "compact" | "premium";
};

export default function CampaignProgressBar({
  progress,
  variant = "default",
}: Props) {
  const t = useTranslations();
  const { current, target, percent, complete } = progress;
  const compact = variant === "compact";
  const premium = variant === "premium";

  return (
    <div className={compact ? "mt-3" : "mt-4"}>
      <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
        <span
          className={
            premium
              ? "font-medium text-zinc-400"
              : "font-medium text-zinc-600"
          }
        >
          {t("campaign.progress")}
        </span>
        <span
          className={`font-semibold ${
            complete
              ? premium
                ? "text-blue-300"
                : "text-blue-600"
              : premium
                ? "text-amber-300"
                : "text-amber-700"
          }`}
        >
          {t("campaign.progressCount", { current, target })}
        </span>
      </div>
      <div
        className={`overflow-hidden rounded-full ${
          premium ? "h-2 bg-white/10" : "h-2 bg-zinc-100"
        }`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            complete
              ? "bg-blue-500"
              : premium
                ? "bg-gradient-to-r from-amber-400 to-orange-400"
                : "bg-gradient-to-r from-amber-400 to-orange-500"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {complete ? (
        <p
          className={`mt-1.5 text-xs font-medium ${
            premium ? "text-blue-300" : "text-blue-600"
          }`}
        >
          {t("campaign.progressComplete")}
        </p>
      ) : (
        <p
          className={`mt-1.5 text-xs ${
            premium ? "text-zinc-500" : "text-zinc-500"
          }`}
        >
          {target > 1
            ? t("campaign.progressHintRentals", { count: target })
            : t("campaign.progressHintSingle")}
        </p>
      )}
    </div>
  );
}
