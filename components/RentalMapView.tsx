"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { Product, RentalLocation } from "@/lib/types";
import { getAggregatedProductInventory, getStockTotal } from "@/lib/locations";
import { getProductById } from "@/lib/products";
import { useTranslations } from "@/lib/i18n/client";
import LocationCard from "./LocationCard";
import MobileMapListSheet, {
  isMapSheetHidden,
  type MapSheetSnap,
} from "./MobileMapListSheet";
import MobileMapProductSheet from "./MobileMapProductSheet";
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
    initialLocationId ?? null,
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
  const [mapFocusId, setMapFocusId] = useState<string | null>(null);
  const [mobileListExpanded, setMobileListExpanded] = useState(false);
  const [sheetSnap, setSheetSnap] = useState<MapSheetSnap>("peek");

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
    if (!initialProductId) return;
    const locationId =
      initialLocationId ??
      locations.find((loc) =>
        loc.products.some((p) => p.productId === initialProductId),
      )?.id;
    if (!locationId) return;
    const location = locations.find((loc) => loc.id === locationId);
    if (!location?.products.some((p) => p.productId === initialProductId)) return;
    setSelectedId(locationId);
    setExpandedLocationId(locationId);
    setExpandedProductId(initialProductId);
    setSheetSnap("half");
  }, [initialProductId, initialLocationId, locations]);

  useEffect(() => {
    if (!selectedId || expandedProductId || isMapSheetHidden(sheetSnap)) return;
    requestAnimationFrame(() => {
      document
        .getElementById(`location-card-${selectedId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }, [selectedId, expandedProductId, sheetSnap]);

  const selectedProduct = selectedProductId
    ? getProductById(selectedProductId, products)
    : null;

  const filteredLocations = selectedProductId
    ? locations.filter((loc) =>
        loc.products.some((p) => p.productId === selectedProductId),
      )
    : locations;

  const selectedLocation = selectedId
    ? filteredLocations.find((loc) => loc.id === selectedId) ?? null
    : null;

  const expandedLocation = expandedLocationId
    ? locations.find((loc) => loc.id === expandedLocationId) ?? null
    : null;
  const expandedStock = expandedLocation?.products.find(
    (p) => p.productId === expandedProductId,
  );
  const expandedProduct = expandedProductId
    ? getProductById(expandedProductId, products)
    : null;

  const mobileFocusedList = Boolean(selectedId) && !mobileListExpanded;

  const listLocations = useMemo(() => {
    if (!mobileFocusedList) return filteredLocations;
    return filteredLocations.filter((loc) => loc.id === selectedId);
  }, [filteredLocations, mobileFocusedList, selectedId]);

  function clearProductExpansion() {
    setExpandedProductId(null);
    setExpandedLocationId(null);
  }

  function clearMobileFocus() {
    setSelectedId(null);
    clearProductExpansion();
    setMapFocusId(null);
    setMobileListExpanded(false);
  }

  function handleProductClick(
    productId: string,
    locationId: string,
    source: "map" | "sidebar" = "sidebar",
  ) {
    setSelectedId(locationId);
    if (
      expandedProductId === productId &&
      expandedLocationId === locationId
    ) {
      clearProductExpansion();
      return;
    }
    setExpandedLocationId(locationId);
    setExpandedProductId(productId);
    if (source === "map") {
      setMapFocusId(locationId);
    }
    if (source === "sidebar") {
      setSheetSnap("half");
    }
  }

  function handleLocationSelect(
    locationId: string,
    source: "map" | "sidebar" = "sidebar",
  ) {
    if (selectedId === locationId && source === "sidebar") {
      setSelectedId(null);
      clearProductExpansion();
      setMapFocusId(null);
      return;
    }

    setSelectedId(locationId);
    clearProductExpansion();
    setMobileListExpanded(false);
    if (source === "map") {
      setMapFocusId(locationId);
      setSheetSnap((current) =>
        current === "full" ? "full" : "half",
      );
    } else {
      setMapFocusId(null);
      setSheetSnap("half");
    }
  }

  const listContent = (
    <>
      {mobileFocusedList && filteredLocations.length > 1 && (
        <button
          type="button"
          onClick={() => setMobileListExpanded(true)}
          className="mb-3 w-full rounded-xl border border-dashed border-zinc-300 bg-white px-4 py-3 text-left text-sm font-medium text-zinc-600 transition-colors hover:border-emerald-300 hover:text-emerald-700 lg:hidden"
        >
          {t("map.browseOtherLocations", {
            count: filteredLocations.length - 1,
          })}
        </button>
      )}

      {listLocations.map((loc) => (
        <LocationCard
          key={loc.id}
          location={loc}
          products={products}
          selected={loc.id === selectedId}
          onSelect={(id) => handleLocationSelect(id, "sidebar")}
          highlightProductId={selectedProductId}
          expandedProductId={
            expandedLocationId === loc.id ? expandedProductId : null
          }
          onProductClick={(productId) =>
            handleProductClick(productId, loc.id, "sidebar")
          }
          onCloseProduct={clearProductExpansion}
          hideEmbeddedQuickView
        />
      ))}
    </>
  );

  const sheetToolbar = (
    <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 pb-2.5">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-zinc-800">
          {t("map.rentalLocations")}
        </p>
        <p className="text-[11px] text-zinc-500">{t("map.dragHint")}</p>
      </div>
      <button
        type="button"
        onClick={() => setSheetSnap("hidden")}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
        aria-label={t("map.expandMap")}
      >
        <span aria-hidden>🗺️</span>
        {t("map.expandMap")}
      </button>
    </div>
  );

  const sheetHeader =
    selectedLocation && !isMapSheetHidden(sheetSnap) ? (
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-200 bg-white px-4 py-2.5">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
            {t("map.selectedLocation")}
          </p>
          <p className="truncate text-sm font-semibold text-zinc-900">
            {selectedLocation.name}
          </p>
        </div>
        <button
          type="button"
          onClick={clearMobileFocus}
          className="shrink-0 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
        >
          {t("map.showAllLocations")}
        </button>
      </div>
    ) : null;

  return (
    <div className="flex h-[calc(100dvh-7.75rem-env(safe-area-inset-bottom,0px))] min-h-0 flex-col overflow-hidden lg:h-[calc(100dvh-4.25rem)]">
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

      <div className="relative min-h-0 flex-1 overflow-hidden lg:flex lg:flex-row">
        <div className="absolute inset-0 lg:relative lg:inset-auto lg:min-h-0 lg:flex-[1.6]">
          <div className="h-full w-full">
            <RentalMap
              locations={filteredLocations}
              products={products}
              selectedId={selectedId}
              focusId={mapFocusId}
              onSelect={(id) => handleLocationSelect(id, "map")}
              highlightProductId={selectedProductId}
              onProductClick={(productId, locationId) =>
                handleProductClick(productId, locationId, "map")
              }
            />
          </div>

          {isMapSheetHidden(sheetSnap) && (
            <button
              type="button"
              onClick={() => setSheetSnap("peek")}
              className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-zinc-200/80 bg-white/95 px-4 py-2.5 text-sm font-semibold text-zinc-800 shadow-lg shadow-zinc-900/10 backdrop-blur-sm transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 lg:hidden"
            >
              <span aria-hidden>📍</span>
              {t("map.showList")}
            </button>
          )}
        </div>

        <aside className="hidden min-h-0 flex-1 overflow-y-auto overscroll-contain border-l border-zinc-200 bg-zinc-50 lg:flex lg:max-w-md lg:flex-[1] xl:max-w-lg">
          <div className="flex w-full flex-col gap-3 p-4 pb-6">
            {listContent}
          </div>
        </aside>

        <MobileMapListSheet
          snap={sheetSnap}
          onSnapChange={setSheetSnap}
          toolbar={sheetToolbar}
          header={sheetHeader}
        >
          <div className="flex flex-col gap-3 p-4 pb-6">{listContent}</div>
        </MobileMapListSheet>
      </div>

      {expandedProduct && expandedStock && expandedLocation && (
        <MobileMapProductSheet
          product={expandedProduct}
          stock={expandedStock}
          location={expandedLocation}
          onClose={clearProductExpansion}
        />
      )}
    </div>
  );
}
