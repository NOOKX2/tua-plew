"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { Product, RentalLocation } from "@/lib/types";
import { getAggregatedProductInventory, getStockTotal } from "@/lib/locations";
import { getProductById } from "@/lib/products";
import { useTranslations } from "@/lib/i18n/client";
import LocationCard from "./LocationCard";
import StockBadge from "./StockBadge";

const RentalMap = dynamic(() => import("./RentalMap"), {
  ssr: false,
  loading: () => <MapLoadingFallback />,
});

function MapLoadingFallback() {
  const t = useTranslations();
  return (
    <div className="flex h-full items-center justify-center bg-zinc-100">
      <p className="text-sm text-zinc-500">{t("map.loading")}</p>
    </div>
  );
}

type Props = {
  initialProductId?: string | null;
  initialLocationId?: string | null;
  locations: RentalLocation[];
  products: Product[];
};

export default function RentalMapView({
  initialProductId = null,
  initialLocationId = null,
  locations,
  products,
}: Props) {
  const t = useTranslations();
  const [selectedId, setSelectedId] = useState<string | null>(
    initialLocationId ?? locations[0]?.id ?? null,
  );
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    initialProductId,
  );
  const [expandedProductId, setExpandedProductId] = useState<string | null>(
    null,
  );
  const [expandedLocationId, setExpandedLocationId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (initialProductId) {
      setSelectedProductId(initialProductId);
    }
  }, [initialProductId]);

  useEffect(() => {
    if (
      initialLocationId &&
      locations.some((loc) => loc.id === initialLocationId)
    ) {
      setSelectedId(initialLocationId);
    }
  }, [initialLocationId, locations]);

  useEffect(() => {
    if (!expandedProductId || !expandedLocationId) return;
    requestAnimationFrame(() => {
      document
        .getElementById(`location-card-${expandedLocationId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }, [expandedProductId, expandedLocationId]);

  const selectedProduct = selectedProductId
    ? getProductById(selectedProductId, products)
    : null;

  const filteredLocations = selectedProductId
    ? locations.filter((loc) =>
        loc.products.some((p) => p.productId === selectedProductId),
      )
    : locations;

  function handleProductClick(productId: string, locationId: string) {
    setSelectedId(locationId);
    if (
      expandedProductId === productId &&
      expandedLocationId === locationId
    ) {
      setExpandedProductId(null);
      setExpandedLocationId(null);
      return;
    }
    setExpandedLocationId(locationId);
    setExpandedProductId(productId);
  }

  function handleLocationSelect(locationId: string) {
    setSelectedId(locationId);
    setExpandedProductId(null);
    setExpandedLocationId(null);
  }

  return (
    <div className="flex h-[calc(100dvh-3.25rem)] flex-col overflow-hidden">
      {selectedProductId && selectedProduct && (
        <div className="shrink-0 border-b border-zinc-200 bg-emerald-50 px-4 py-2 sm:px-6">
          <div className="flex flex-wrap items-center gap-2 text-sm text-emerald-800">
            <span className="text-xs font-medium">{t("common.filterBy")}</span>
            <span className="font-semibold">{selectedProduct.name}</span>
            <StockBadge
              total={getStockTotal(
                getAggregatedProductInventory(
                  selectedProduct.id,
                  locations,
                  products,
                ),
              )}
              unit={selectedProduct.sizeUnit}
              size="sm"
            />
            <button
              type="button"
              onClick={() => setSelectedProductId(null)}
              className="ml-auto text-xs font-medium underline hover:no-underline"
            >
              {t("common.clearFilter")}
            </button>
          </div>
        </div>
      )}

      <div className="flex min-h-0 flex-1 overflow-hidden lg:flex-row">
        <div className="h-[38vh] min-h-[200px] shrink-0 lg:h-full lg:min-h-0 lg:flex-[1.6]">
          <div className="h-full w-full">
            <RentalMap
              locations={filteredLocations}
              products={products}
              selectedId={selectedId}
              onSelect={handleLocationSelect}
              highlightProductId={selectedProductId}
              onProductClick={handleProductClick}
            />
          </div>
        </div>

        <aside className="min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-zinc-200 bg-zinc-50 lg:max-w-md lg:flex-[1] lg:border-t-0 lg:border-l xl:max-w-lg">
          <div className="flex flex-col gap-3 p-4 pb-6">
            {filteredLocations.map((loc) => (
              <LocationCard
                key={loc.id}
                location={loc}
                products={products}
                selected={loc.id === selectedId}
                onSelect={handleLocationSelect}
                highlightProductId={selectedProductId}
                expandedProductId={
                  expandedLocationId === loc.id ? expandedProductId : null
                }
                onProductClick={(productId) =>
                  handleProductClick(productId, loc.id)
                }
                onCloseProduct={() => {
                  setExpandedProductId(null);
                  setExpandedLocationId(null);
                }}
              />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
