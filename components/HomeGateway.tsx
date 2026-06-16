import Image from "next/image";
import Link from "next/link";
import { getTranslator } from "@/lib/i18n/server";

type Props = {
  eventCount: number;
  participantCount: number;
  locationCount: number;
  productCount: number;
  readyCount: number;
};

export default async function HomeGateway({
  eventCount,
  participantCount,
  locationCount,
  productCount,
  readyCount,
}: Props) {
  const t = await getTranslator();

  const cards = [
    {
      href: "/community",
      image: "/community/lumpini-run-club.jpg",
      imageAlt: t("home.gatewayCommunityImageAlt"),
      eyebrow: t("home.gatewayCommunityEyebrow"),
      title: t("home.gatewayCommunityTitle"),
      description: t("home.gatewayCommunityDesc"),
      stats: [
        t("home.eventCount", { count: eventCount }),
        t("home.participantCount", { count: participantCount }),
      ],
      cta: t("home.gatewayCommunityCta"),
      ctaClass:
        "bg-blue-500 text-zinc-950 group-hover:bg-blue-400",
      eyebrowClass: "text-blue-300",
    },
    {
      href: "/rentals/shop",
      image: "/products/leggings.jpg",
      imageAlt: t("home.gatewayRentalImageAlt"),
      eyebrow: t("home.gatewayRentalEyebrow"),
      title: t("home.gatewayRentalTitle"),
      description: t("home.gatewayRentalDesc"),
      stats: [
        t("home.productCount", { count: productCount }),
        t("home.readyCount", { count: readyCount }),
      ],
      cta: t("home.gatewayRentalCta"),
      ctaClass: "bg-white text-zinc-950 group-hover:bg-blue-50",
      eyebrowClass: "text-blue-200",
    },
  ];

  return (
    <section className="px-4 pt-6 sm:px-6 sm:pt-8">
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 md:gap-6">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group relative min-h-[220px] overflow-hidden rounded-[1.5rem] border border-zinc-900/10 shadow-lg shadow-zinc-900/10 transition-transform hover:-translate-y-0.5 sm:min-h-[260px]"
          >
            <Image
              src={card.image}
              alt={card.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/75 to-zinc-900/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/60 to-transparent" />

            <div className="relative flex h-full flex-col justify-end p-5 sm:p-6">
              <p
                className={`mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] sm:text-[11px] ${card.eyebrowClass}`}
              >
                {card.eyebrow}
              </p>
              <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                {card.title}
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/75">
                {card.description}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/70">
                {card.stats.map((stat, i) => (
                  <span key={stat}>
                    {i > 0 && <span className="mr-3 text-white/30">·</span>}
                    {stat}
                  </span>
                ))}
              </div>
              <span
                className={`mt-4 inline-flex w-fit items-center rounded-full px-4 py-2 text-sm font-semibold transition-colors ${card.ctaClass}`}
              >
                {card.cta}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
