"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { Product, RentalLocation } from "@/lib/types";
import {
  getAggregatedProductInventory,
  getStockTotal,
  rentalLocations as fallbackLocations,
} from "@/lib/locations";
import { products as fallbackProducts } from "@/lib/products";
import { getProductById } from "@/lib/products";
import LocationCard from "./LocationCard";
import ProductCard from "./ProductCard";
import ProductCatalog from "./ProductCatalog";
import StockBadge from "./StockBadge";

const RentalMap = dynamic(() => import("./RentalMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center rounded-xl bg-zinc-100">
      <p className="text-sm text-zinc-500">กำลังโหลดแผนที่...</p>
    </div>
  ),
});

type Props = {
  initialProductId?: string | null;
};

export default function RentalApp({ initialProductId = null }: Props) {
  const [locations, setLocations] = useState<RentalLocation[]>(fallbackLocations);
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [selectedId, setSelectedId] = useState<string | null>(
    fallbackLocations[0]?.id ?? null,
  );
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    initialProductId,
  );
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = useCallback(async () => {
    try {
      const [locRes, prodRes] = await Promise.all([
        fetch("/api/locations"),
        fetch("/api/products"),
      ]);
      if (locRes.ok) {
        setLocations(await locRes.json());
        setLastUpdated(new Date());
      }
      if (prodRes.ok) {
        setProducts(await prodRes.json());
      }
    } catch {
      /* keep fallback data */
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  useEffect(() => {
    if (initialProductId) {
      setSelectedProductId(initialProductId);
      requestAnimationFrame(() => {
        document.getElementById("locations")?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [initialProductId]);

  const selected = locations.find((l) => l.id === selectedId);
  const selectedProduct = selectedProductId
    ? getProductById(selectedProductId)
    : null;

  const filteredLocations = selectedProductId
    ? locations.filter((loc) =>
        loc.products.some((p) => p.productId === selectedProductId),
      )
    : locations;

  return (
    <div className="flex flex-1 flex-col">
      <section className="bg-gradient-to-br from-emerald-600 to-teal-700 px-4 py-8 text-white sm:px-6 sm:py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-1 text-sm font-medium text-emerald-100">
            On-Site Activewear Rental
          </div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Fit-to-Go
          </h1>
          <p className="max-w-xl text-emerald-50/90">
            เช่าชุดกีฬาสะอาด พร้อมออกกำลังกายทันที — เลือกสินค้า ดูสต็อกแต่ละไซส์
            และค้นหาจุดเช่าใกล้คุณบนแผนที่
          </p>
        </div>
      </section>

      <ProductCatalog
        products={products}
        locations={locations}
        selectedProductId={selectedProductId}
      />

      {selectedProductId && selectedProduct && (
        <div className="mx-auto mb-4 w-full max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
            <span>กรองตาม:</span>
            <Link
              href={`/products/${selectedProduct.id}`}
              className="font-semibold underline hover:no-underline"
            >
              {selectedProduct.name}
            </Link>
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
        </div>
      )}

      <section
        id="locations"
        className="mx-auto w-full max-w-6xl flex-1 scroll-mt-4 px-4 pb-8 sm:px-6"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-zinc-900">
            จุดเช่าชุดกีฬา
          </h2>
          <p className="text-xs text-zinc-500">
            อัปเดตล่าสุด{" "}
            {lastUpdated.toLocaleTimeString("th-TH", {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {" · "}
            รีเฟรชอัตโนมัติทุก 30 วินาที
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-[320px] overflow-hidden rounded-xl border border-zinc-200 shadow-sm sm:h-[420px] lg:h-[600px] lg:sticky lg:top-4">
            <RentalMap
              locations={filteredLocations}
              selectedId={selectedId}
              onSelect={setSelectedId}
              highlightProductId={selectedProductId}
            />
          </div>

          <div className="flex flex-col gap-3">
            {selected && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-emerald-600">
                  จุดที่เลือก — สินค้าพร้อมเช่า
                </p>
                <h3 className="mb-1 text-xl font-bold text-zinc-900">
                  {selected.name}
                </h3>
                <p className="mb-4 text-sm text-zinc-600">{selected.address}</p>

                <div className="flex flex-col gap-4">
                  {selected.products.map((stock) => {
                    const product = getProductById(stock.productId);
                    if (!product) return null;
                    return (
                      <div key={stock.productId}>
                        <Link
                          href={`/products/${product.id}`}
                          className="mb-2 inline-block text-xs font-medium text-emerald-600 hover:underline"
                        >
                          ดูรายละเอียดสินค้า →
                        </Link>
                        <ProductCard
                          product={product}
                          stock={stock}
                          variant="location"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {filteredLocations.map((loc) => (
                <LocationCard
                  key={loc.id}
                  location={loc}
                  selected={loc.id === selectedId}
                  onSelect={setSelectedId}
                  highlightProductId={selectedProductId}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-200 bg-zinc-50 px-4 py-6 text-center text-xs text-zinc-500 sm:px-6">
        <p>Fit-to-Go · Workout to Hangout · ชุดกีฬาสะอาด มาตรฐานซักฆ่า Ozone</p>
      </footer>
    </div>
  );
}
