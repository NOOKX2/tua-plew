import Image from "next/image";
import Link from "next/link";
import type {
  CommunityEvent,
  EventJoinPerk,
  Product,
  RentalLocation,
} from "@/lib/types";
import type { Locale } from "@/lib/i18n/config";
import { getAggregatedProductInventory, getStockTotal } from "@/lib/locations";
import { getProductById } from "@/lib/products";
import { getTranslator } from "@/lib/i18n/server";
import {
  formatEventDate,
  formatEventTime,
} from "@/lib/i18n/format";
import PerkCard from "./PerkCard";
import StockBadge from "./StockBadge";

type Props = {
  event: CommunityEvent;
  perks: EventJoinPerk[];
  location: RentalLocation | undefined;
  locations: RentalLocation[];
  products: Product[];
  locale: Locale;
};

export default async function CommunityJoinWelcome({
  event,
  perks,
  location,
  locations,
  products,
  locale,
}: Props) {
  const t = await getTranslator();
  const recommended = event.recommendedProductIds
    .map((id) => getProductById(id, products))
    .filter((product) => product !== undefined);

  const rentalPerk = perks.find((perk) => perk.category === "rental");
  const partnerPerks = perks.filter((perk) => perk.category !== "rental");

  return (
    <main className="relative flex-1 overflow-x-hidden bg-[#faf9f6] pb-28 lg:pb-14">
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-emerald-300/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 top-64 h-72 w-72 rounded-full bg-violet-200/20 blur-3xl" />

      <section className="relative overflow-hidden border-b border-zinc-200/80 bg-zinc-950 text-white">
        <div className="absolute inset-0">
          <Image
            src={event.image}
            alt={event.title}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-zinc-950/70" />
        </div>

        <div className="relative mx-auto max-w-7xl min-w-0 px-4 py-10 sm:px-8 sm:py-14 lg:px-10">
          <Link
            href={`/community/${event.id}`}
            className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20"
          >
            {t("community.joinWelcome.backToEvent")}
          </Link>

          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
            {t("community.joinWelcome.eyebrow")}
          </p>
          <h1 className="mt-2 max-w-3xl break-words text-3xl font-bold tracking-tight sm:text-4xl">
            {t("community.joinWelcome.title")}
          </h1>
          <p className="mt-3 max-w-2xl break-words text-sm leading-relaxed text-white/80 sm:text-base">
            {t("community.joinWelcome.subtitle", { event: event.title })}
          </p>

          <div className="mt-6 flex max-w-full flex-wrap gap-3 text-sm text-white/75">
            <span className="max-w-full rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-sm">
              📅 {formatEventDate(event.date, locale)}
            </span>
            <span className="max-w-full rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-sm">
              🕐{" "}
              {formatEventTime(
                event.startTime,
                event.endTime,
                locale,
                t("community.timeSuffix"),
              )}
            </span>
            <span className="max-w-full break-words rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-sm">
              📍 {event.venue}
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto min-w-0 max-w-7xl space-y-10 px-4 py-10 sm:px-8 lg:px-10">
        <section className="overflow-hidden rounded-[1.5rem] border border-emerald-200/70 bg-white shadow-sm">
          <div className="border-b border-emerald-100 px-6 py-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-600">
              {t("community.social.chat.groupTitle")}
            </p>
            <h2 className="mt-1 text-xl font-bold text-zinc-900">
              {event.title}
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              {t("community.social.chat.groupSubtitle")}
            </p>
          </div>
          <div className="px-6 py-5">
            <Link
              href={`/community/${event.id}/chat`}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
            >
              💬 {t("community.social.chat.openGroup")}
            </Link>
          </div>
        </section>

        <section className="min-w-0 overflow-hidden rounded-[1.5rem] border border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-white to-white shadow-sm">
          <div className="border-b border-emerald-100/80 px-4 py-5 sm:px-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-600">
              {t("community.joinWelcome.rentalEyebrow")}
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900">
              {t("community.joinWelcome.rentalTitle")}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
              {t("community.joinWelcome.rentalSubtitle")}
            </p>
            {rentalPerk && (
              <p className="mt-3 inline-flex max-w-full items-center gap-2 break-words rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                {t("community.joinWelcome.useCode", { code: rentalPerk.code })}
              </p>
            )}
          </div>

          {recommended.length > 0 ? (
            <div className="grid min-w-0 gap-4 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
              {recommended.map((product) => {
                const total = getStockTotal(
                  getAggregatedProductInventory(
                    product.id,
                    locations,
                    products,
                  ),
                );
                const mapHref = location
                  ? `/map?product=${product.id}&location=${location.id}`
                  : `/map?product=${product.id}`;

                return (
                  <Link
                    key={product.id}
                    href={mapHref}
                    className="group min-w-0 overflow-hidden rounded-[1.25rem] border border-zinc-200/80 bg-white transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-b from-zinc-50 to-white">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-5 transition-transform duration-300 lg:group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="border-t border-zinc-100 p-4">
                      <p className="font-bold text-zinc-900">{product.name}</p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-zinc-900">
                          ฿{product.pricePerRental}
                          <span className="text-xs font-normal text-zinc-400">
                            {t("common.perRental")}
                          </span>
                        </p>
                        <StockBadge
                          total={total}
                          unit={product.sizeUnit}
                          size="sm"
                        />
                      </div>
                      <p className="mt-3 text-xs font-semibold text-emerald-600">
                        {t("community.joinWelcome.rentProduct")} →
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-6">
              <Link
                href={location ? `/map?location=${location.id}` : "/map"}
                className="inline-flex items-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400"
              >
                {t("community.findNearbyRental")}
              </Link>
            </div>
          )}

          <div className="flex flex-wrap gap-3 border-t border-emerald-100/80 px-4 py-5 sm:px-6">
            <Link
              href={location ? `/map?location=${location.id}` : "/map"}
              className="inline-flex items-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
            >
              {t("community.joinWelcome.viewRentalMap")}
            </Link>
            <Link
              href="/#catalog"
              className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-900"
            >
              {t("community.joinWelcome.browseCatalog")}
            </Link>
          </div>
        </section>

        {partnerPerks.length > 0 && (
          <section className="min-w-0 overflow-hidden">
            <div className="mb-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-600">
                {t("community.joinWelcome.perksEyebrow")}
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                {t("community.joinWelcome.perksTitle")}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
                {t("community.joinWelcome.perksSubtitle")}
              </p>
            </div>

            <div className="grid min-w-0 gap-4 lg:grid-cols-2">
              {partnerPerks.map((perk) => (
                <PerkCard key={perk.id} perk={perk} />
              ))}
            </div>
          </section>
        )}

        <section className="min-w-0 overflow-hidden rounded-[1.25rem] border border-dashed border-zinc-300 bg-white px-4 py-5 text-sm text-zinc-600 sm:px-6">
          <p className="font-semibold text-zinc-800">
            {t("community.joinWelcome.termsTitle")}
          </p>
          <p className="mt-2 leading-relaxed">
            {t("community.joinWelcome.termsBody")}
          </p>
        </section>
      </div>
    </main>
  );
}
