import Link from "next/link";
import { getTranslator } from "@/lib/i18n/server";

type Props = {
  productCount: number;
  locationCount: number;
  readyCount: number;
};

export default async function HomeHero({
  productCount,
  locationCount,
  readyCount,
}: Props) {
  const t = await getTranslator();

  const stats = [
    t("home.productCount", { count: productCount }),
    t("home.locationCount", { count: locationCount }),
    t("home.readyCount", { count: readyCount }),
  ];

  return (
    <section className="px-4 pt-3 sm:px-6 sm:pt-4">
      <div className="relative mx-auto max-w-7xl">
        <div className="home-hero-panel overflow-hidden rounded-2xl border border-zinc-900/10 bg-zinc-950 text-white shadow-lg shadow-emerald-900/10">
          <div className="home-hero-grid absolute inset-0 opacity-30" />

          <div className="relative px-4 py-5 sm:px-6 sm:py-6">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-200/90 sm:text-[11px]">
              {t("home.tagline")}
            </p>

            <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              {t("home.heroTitle")}
              <span className="text-emerald-300"> {t("home.heroTitleAccent")}</span>
            </h1>

            <p className="mt-2 line-clamp-2 max-w-2xl text-xs leading-snug text-zinc-300 sm:text-sm">
              {t("home.subtitle")}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              <Link
                href="/map"
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold text-zinc-950 transition-colors hover:bg-emerald-300 sm:text-sm"
              >
                {t("home.viewMap")}
              </Link>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-emerald-100/80 sm:text-sm">
                {stats.map((label, i) => (
                  <span key={label}>
                    {i > 0 && (
                      <span className="mr-3 hidden text-white/20 sm:inline">|</span>
                    )}
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
