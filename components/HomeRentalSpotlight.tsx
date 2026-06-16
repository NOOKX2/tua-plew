import Link from "next/link";
import { getTranslator } from "@/lib/i18n/server";

type Props = {
  productCount: number;
  locationCount: number;
  readyCount: number;
};

export default async function HomeRentalSpotlight({
  productCount,
  locationCount,
  readyCount,
}: Props) {
  const t = await getTranslator();

  const tiers = [
    { emoji: "🏃", label: t("home.spotlightTierEssential") },
    { emoji: "🧘", label: t("home.spotlightTierStudio") },
    { emoji: "🔥", label: t("home.spotlightTierTactical") },
  ];

  return (
    <section className="px-4 pt-6 sm:px-6 sm:pt-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-linear-to-br from-blue-600 via-blue-600 to-blue-700 shadow-xl shadow-blue-900/20">
        <div
          className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl"
          aria-hidden
        />
        <div
          className="absolute -bottom-16 -left-10 h-52 w-52 rounded-full bg-blue-300/25 blur-3xl"
          aria-hidden
        />

        <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="max-w-xl">
            <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white ring-1 ring-white/20">
              {t("home.spotlightEyebrow")}
            </p>
            <h2 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
              {t("home.spotlightTitle")}
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-blue-50/90 sm:text-base">
              {t("home.spotlightSubtitle")}
            </p>

            <p className="mt-3 text-xs font-medium text-blue-100/90 sm:text-sm">
              {t("home.productCount", { count: productCount })} ·{" "}
              {t("home.locationCount", { count: locationCount })} ·{" "}
              {t("home.readyCount", { count: readyCount })}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href="/rentals/shop"
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-6 py-3 text-sm font-bold text-blue-700 shadow-lg shadow-blue-900/20 transition-transform hover:-translate-y-0.5"
              >
                {t("home.spotlightCta")}
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/map"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                {t("home.spotlightMapCta")}
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 lg:w-80 lg:shrink-0">
            {tiers.map((tier) => (
              <Link
                key={tier.label}
                href="/rentals/shop"
                className="flex flex-col items-center gap-1.5 rounded-2xl bg-white/10 px-2 py-4 text-center ring-1 ring-white/15 backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <span className="text-2xl" aria-hidden>
                  {tier.emoji}
                </span>
                <span className="text-xs font-semibold leading-tight text-white">
                  {tier.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
