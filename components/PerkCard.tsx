"use client";

import { useState } from "react";
import type { EventJoinPerk, EventJoinPerkCategory } from "@/lib/types";
import { useTranslations } from "@/lib/i18n/client";

const CATEGORY_STYLES: Record<
  EventJoinPerkCategory,
  { emoji: string; ring: string; badge: string }
> = {
  rental: {
    emoji: "👕",
    ring: "ring-blue-200",
    badge: "bg-blue-100 text-blue-800",
  },
  food: {
    emoji: "🍽️",
    ring: "ring-orange-200",
    badge: "bg-orange-100 text-orange-800",
  },
  coffee: {
    emoji: "☕",
    ring: "ring-amber-200",
    badge: "bg-amber-100 text-amber-800",
  },
  gaming: {
    emoji: "🎮",
    ring: "ring-violet-200",
    badge: "bg-violet-100 text-violet-800",
  },
};

type Props = {
  perk: EventJoinPerk;
};

export default function PerkCard({ perk }: Props) {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);
  const style = CATEGORY_STYLES[perk.category];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(perk.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <article
      className={`min-w-0 overflow-hidden rounded-[1.25rem] border border-zinc-200/80 bg-white shadow-sm ring-1 ${style.ring} ${
        perk.highlight ? "shadow-md shadow-blue-900/5" : ""
      }`}
    >
      <div className="border-b border-zinc-100 px-5 py-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${style.badge}`}
          >
            <span aria-hidden>{style.emoji}</span>
            {t(`community.joinWelcome.perkCategories.${perk.category}`)}
          </span>
          {perk.highlight && (
            <span className="rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              {t("community.joinWelcome.recommended")}
            </span>
          )}
        </div>
        <p className="text-xs font-medium text-zinc-500">{perk.partnerName}</p>
        <h3 className="mt-1 text-lg font-bold tracking-tight text-zinc-900">
          {perk.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          {perk.description}
        </p>
      </div>

      <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
            {t("community.joinWelcome.promoCode")}
          </p>
          <p className="mt-1 truncate font-mono text-xl font-bold tracking-wider text-zinc-900">
            {perk.code}
          </p>
          {perk.validUntil && (
            <p className="mt-1 text-xs text-zinc-500">
              {t("community.joinWelcome.validUntil", { date: perk.validUntil })}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
        >
          {copied
            ? t("community.joinWelcome.copied")
            : t("community.joinWelcome.copyCode")}
        </button>
      </div>
    </article>
  );
}
