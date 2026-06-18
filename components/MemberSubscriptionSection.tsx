import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import type { SubscriptionStatus } from "@/lib/subscription";
import { getLocale, getTranslator } from "@/lib/i18n/server";

type Props = {
  status: SubscriptionStatus;
};

function formatDate(iso: string, locale: "th" | "en") {
  return new Date(iso).toLocaleDateString(locale === "th" ? "th-TH" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function MemberSubscriptionSection({ status }: Props) {
  const [t, locale] = await Promise.all([getTranslator(), getLocale()]);

  const hasActivePlan = status.plan && status.periodEnd;

  return (
    <section className="overflow-hidden rounded-2xl border border-violet-200/80 bg-linear-to-br from-violet-50 via-white to-fuchsia-50/30 shadow-sm">
      <div className="border-b border-violet-100/80 px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-700/80">
          {t("subscription.title")}
        </p>
        {hasActivePlan && status.plan ? (
          <div className="mt-2 flex items-end justify-between gap-3">
            <div>
              <p className="text-2xl font-bold tracking-tight text-zinc-900">
                {t(`subscription.plans.${status.plan}.name`)}
              </p>
              <p className="mt-1 text-sm text-violet-700">
                {t("subscription.used", {
                  used: status.rentalsUsed,
                  limit: status.rentalsLimit,
                })}
              </p>
            </div>
            <p className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-800">
              {t("subscription.remaining", { remaining: status.remaining })}
            </p>
          </div>
        ) : (
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            {t("subscription.noPlan")}
          </p>
        )}
      </div>

      <div className="px-5 py-4">
        {hasActivePlan && status.periodEnd ? (
          <p className="mb-3 text-xs text-zinc-500">
            {t("subscription.renewsOn", {
              date: formatDate(status.periodEnd, locale),
            })}
          </p>
        ) : (
          <p className="mb-3 text-xs text-zinc-500">{t("subscription.subtitle")}</p>
        )}

        <Link
          href="/member/subscribe"
          className="group flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
        >
          <Sparkles className="h-4 w-4" aria-hidden />
          {hasActivePlan
            ? t("subscription.changePlan")
            : t("subscription.subscribeCta")}
          <ChevronRight
            className="h-4 w-4 opacity-70 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </div>
    </section>
  );
}
