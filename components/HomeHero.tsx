import Image from "next/image";
import Link from "next/link";
import { getTranslator } from "@/lib/i18n/server";

type Props = {
  eventCount: number;
  participantCount: number;
  activityTypeCount: number;
  locationCount: number;
  productCount: number;
  readyCount: number;
};

export default async function HomeHero({
  eventCount,
  participantCount,
  activityTypeCount,
  locationCount,
  productCount,
  readyCount,
}: Props) {
  const t = await getTranslator();

  const communityStats = [
    t("home.eventCount", { count: eventCount }),
    t("home.participantCount", { count: participantCount }),
    t("home.activityCount", { count: activityTypeCount }),
  ];

  const rentalStats = [
    t("home.productCount", { count: productCount }),
    t("home.locationCount", { count: locationCount }),
    t("home.readyCount", { count: readyCount }),
  ];

  return (
    <section className="px-4 pt-3 sm:px-6 sm:pt-4">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] border border-zinc-900/10 shadow-xl shadow-zinc-900/10">
        <div className="relative min-h-[420px] sm:min-h-[360px]">
          <div className="absolute inset-0 grid md:grid-cols-2">
            <div className="relative min-h-[140px] md:min-h-0">
              <Image
                src="/community/lumpini-run-club.jpg"
                alt={t("home.heroCommunityImageAlt")}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="relative min-h-[140px] md:min-h-0">
              <Image
                src="/products/yoga-set.jpg"
                alt={t("home.heroRentalImageAlt")}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-900/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/70 via-zinc-950/50 to-zinc-950/70" />
          <div className="home-hero-grid absolute inset-0 opacity-[0.06]" />

          <div className="relative flex h-full flex-col justify-end px-5 py-6 sm:px-8 sm:py-8">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-300/90 sm:text-[11px]">
              {t("home.tagline")}
            </p>

            <h1 className="max-w-3xl text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-5xl">
              {t("home.heroTitle")}
              <span className="text-blue-300">
                {" "}
                {t("home.heroTitleAccent")}
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
              {t("home.subtitle")}
            </p>

            <div className="mt-5 grid gap-3 sm:flex sm:flex-wrap">
              <Link
                href="/community"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-blue-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-blue-300"
              >
                {t("home.browseEvents")}
              </Link>
              <Link
                href="/map"
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-blue-50"
              >
                {t("home.rentGear")}
              </Link>
            </div>

            <div className="mt-6 flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-300/90">
                  {t("home.heroCommunityLabel")}
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/85 sm:text-sm">
                  {communityStats.map((label, i) => (
                    <span key={label}>
                      {i > 0 && (
                        <span className="mr-3 text-white/25">·</span>
                      )}
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-300/90">
                  {t("home.heroRentalLabel")}
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/85 sm:text-sm">
                  {rentalStats.map((label, i) => (
                    <span key={label}>
                      {i > 0 && (
                        <span className="mr-3 text-white/25">·</span>
                      )}
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
