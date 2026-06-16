import Image from "next/image";
import Link from "next/link";
import type { Product, RentalLocation } from "@/lib/types";
import { getAggregatedProductInventory } from "@/lib/locations";
import { getTranslator } from "@/lib/i18n/server";
import ApparelTiers from "./ApparelTiers";
import HomeCatalogSection, { type CatalogItem } from "./HomeCatalogSection";
import PartnerShoeCatalog from "./PartnerShoeCatalog";
import type { ProductRatingSummary } from "@/lib/types";

type Props = {
  locations: RentalLocation[];
  products: Product[];
  catalogItems: CatalogItem[];
  ratingSummaries: Record<string, ProductRatingSummary>;
};

export default async function HomeRentalSection({
  locations,
  products,
  catalogItems,
  ratingSummaries,
}: Props) {
  const t = await getTranslator();
  const locationCount = locations.length;
  const productCount = products.filter((p) => !p.isPartnerBrand).length;
  const readyCount = products.reduce(
    (sum, product) =>
      sum +
      Object.values(
        getAggregatedProductInventory(product.id, locations, products),
      ).reduce((a, b) => a + b, 0),
    0,
  );

  return (
    <section id="rentals" className="scroll-mt-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10">
        <div className="relative mb-8 overflow-hidden rounded-[1.5rem] border border-zinc-200/80 shadow-md shadow-zinc-900/5">
          <div className="relative min-h-[200px] sm:min-h-[240px]">
            <Image
              src="/products/running-shorts.jpg"
              alt={t("home.rentalBannerImageAlt")}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/70 to-zinc-950/30" />

            <div className="relative flex h-full flex-col justify-center px-5 py-8 sm:px-8 sm:py-10">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">
                {t("home.rentalEyebrow")}
              </p>
              <h2 className="max-w-xl text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {t("home.rentalTitle")}
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
                {t("home.rentalSubtitle")}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Link
                  href="/map"
                  className="inline-flex items-center rounded-full bg-blue-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-blue-300"
                >
                  {t("home.viewMap")}
                </Link>
                <Link
                  href="#catalog"
                  className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  {t("home.exploreCatalog")}
                </Link>
              </div>
              <p className="mt-4 text-xs text-blue-100/90 sm:text-sm">
                {t("home.productCount", { count: productCount })} ·{" "}
                {t("home.locationCount", { count: locationCount })} ·{" "}
                {t("home.readyCount", { count: readyCount })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <ApparelTiers />

      <HomeCatalogSection items={catalogItems} embedded />

      <PartnerShoeCatalog
        products={products}
        locations={locations}
        ratingSummaries={ratingSummaries}
      />
    </section>
  );
}
