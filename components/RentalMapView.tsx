"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { Product, RentalLocation } from "@/lib/types";
import { getAggregatedProductInventory, getStockTotal } from "@/lib/locations";
import { getProductById } from "@/lib/products";
import LocationCard from "./LocationCard";
import StockBadge from "./StockBadge";

const RentalMap = dynamic(() => import("./RentalMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-zinc-100">
      <p className="text-sm text-zinc-500">กำลังโหลดแผนที่...</p>
    </div>
  ),
});

type Props = {
  initialProductId?: string | null;
  locations: RentalLocation[];
  products: Product[];
};

export default function RentalMapView({
  initialProductId = null,
  locations,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(
    locations[0]?.id ?? null,
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
    if (!expandedProductId || !expandedLocationId) return;
    requestAnimationFrame(() => {
      document
        .getElementById(`location-card-${expandedLocationId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }, [expandedProductId, expandedLocationId]);

  const selectedProduct = selectedProductId
    ? getProductById(selectedProductId)
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
      <div className="shrink-0 border-b border-zinc-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
              จุดเช่า
            </p>
            <h1 className="text-lg font-bold text-zinc-900 sm:text-xl">
              แผนที่จุดเช่าชุดกีฬา
            </h1>
            <p className="mt-0.5 text-xs text-zinc-500">
              แตะสินค้าในการ์ดเพื่อดูไซส์และเช่า
            </p>
          </div>
          <p className="text-xs text-zinc-500">
            {filteredLocations.length} จุด
            {selectedProductId && selectedProduct
              ? ` · กรองตาม ${selectedProduct.name}`
              : ""}
          </p>
        </div>

        {selectedProductId && selectedProduct && (
          <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            <span className="text-xs font-medium">กรองตาม:</span>
            <span className="font-semibold">{selectedProduct.name}</span>
            <StockBadge
              total={getStockTotal(
                getAggregatedProductInventory(selectedProduct.id, locations),
              )}
              unit={selectedProduct.sizeUnit}
              size="sm"
            />
            <button
              type="button"
              onClick={() => setSelectedProductId(null)}
              className="ml-auto text-xs font-medium underline hover:no-underline"
            >
              ล้างตัวกรอง
            </button>
          </div>
        )}
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden lg:flex-row">
        <div className="h-[38vh] min-h-[200px] shrink-0 lg:h-full lg:min-h-0 lg:flex-[1.6]">
          <div className="h-full w-full">
            <RentalMap
              locations={filteredLocations}
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
