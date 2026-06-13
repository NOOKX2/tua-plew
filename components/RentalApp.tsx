import Link from "next/link";
import type { Product, RentalLocation } from "@/lib/types";
import { getAggregatedProductInventory, getStockTotal } from "@/lib/locations";
import { getProductRatingSummaries } from "@/lib/reviews";
import { getTranslator } from "@/lib/i18n/server";
import ProductCatalog from "./ProductCatalog";
import PartnerShoeCatalog from "./PartnerShoeCatalog";

type Props = {
  locations: RentalLocation[];
  products: Product[];
};

export default async function RentalApp({ locations, products }: Props) {
  const t = await getTranslator();
  const partnerShoeIds = products
    .filter((p) => p.isPartnerBrand)
    .map((p) => p.id);
  const ratingSummaries = await getProductRatingSummaries(partnerShoeIds);
  const totalStock = products.reduce(
    (sum, p) =>
      sum + getStockTotal(getAggregatedProductInventory(p.id, locations, products)),
    0,
  );

  return (
    <div className="flex flex-1 flex-col">
      <section className="bg-gradient-to-br from-emerald-600 to-teal-700 px-4 py-6 text-white sm:px-6 sm:py-8">
        <div className="mx-auto max-w-6xl">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-emerald-100 sm:text-sm">
            {t("home.tagline")}
          </p>
          <h1 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Tua Plew
          </h1>
          <p className="max-w-xl text-sm leading-snug text-emerald-50/90 sm:text-base">
            {t("home.subtitle")}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/map"
              className="inline-flex items-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
            >
              {t("home.viewMap")}
            </Link>
            <div className="flex gap-4 text-sm text-emerald-100">
              <span>{t("home.productCount", { count: products.length })}</span>
              <span>{t("home.locationCount", { count: locations.length })}</span>
              <span>{t("home.readyCount", { count: totalStock })}</span>
            </div>
          </div>
        </div>
      </section>

      <PartnerShoeCatalog
        products={products}
        locations={locations}
        ratingSummaries={ratingSummaries}
      />

      <ProductCatalog products={products} locations={locations} />

      <footer className="border-t border-zinc-200 bg-zinc-50 px-4 py-6 text-center text-xs text-zinc-500 sm:px-6">
        <p>{t("home.footer")}</p>
      </footer>
    </div>
  );
}
