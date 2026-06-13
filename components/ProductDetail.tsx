"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import {
  getAggregatedProductInventory,
  getLocationsWithProduct,
  getTotalProductStock,
} from "@/lib/locations";
import { getRelatedProducts } from "@/lib/products";
import ProductAvailabilityList from "./ProductAvailabilityList";
import SizeInventory from "./SizeInventory";
import StockBadge from "./StockBadge";

type Props = {
  product: Product;
  compact?: boolean;
};

function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="rounded-xl border border-zinc-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
        <span className="text-xs text-zinc-400">{open ? "ซ่อน" : "ดู"}</span>
      </button>
      {open && <div className="border-t border-zinc-100 px-4 pb-4 pt-3">{children}</div>}
    </section>
  );
}

export default function ProductDetail({ product, compact = false }: Props) {
  const availability = getLocationsWithProduct(product.id);
  const aggregatedInventory = getAggregatedProductInventory(product.id);
  const totalStock = getTotalProductStock(product.id);
  const related = getRelatedProducts(product.id);
  const isShoe = product.category === "shoe";
  const hasWaist = product.sizeGuide.some((row) => row.waist);
  const hasChest = product.sizeGuide.some((row) => row.chest);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8">
      {compact && (
        <Link
          href="/map"
          className="mb-4 inline-flex items-center text-sm font-medium text-emerald-600 hover:underline"
        >
          ← กลับแผนที่
        </Link>
      )}

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
        <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm lg:max-w-none">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-8"
            sizes="(max-width: 1024px) 384px, 50vw"
            priority
          />
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-sm font-semibold text-zinc-700 shadow-sm">
            {CATEGORY_LABELS[product.category]}
          </span>
          <div className="absolute bottom-4 right-4">
            <StockBadge total={totalStock} unit={product.sizeUnit} size="lg" />
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="mb-2 text-2xl font-bold text-zinc-900 sm:text-3xl">
            {product.name}
          </h1>
          <p className="mb-4 text-sm leading-relaxed text-zinc-600">
            {compact ? product.description : product.longDescription}
          </p>

          <div className="mb-4 flex flex-wrap items-center gap-3">
            <p className="text-2xl font-bold text-emerald-600">
              ฿{product.pricePerRental}
              <span className="text-base font-normal text-zinc-500"> /ครั้ง</span>
            </p>
            <StockBadge total={totalStock} unit={product.sizeUnit} size="md" />
          </div>

          <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-4">
            <p className="mb-2 text-xs font-medium text-zinc-600">
              สต็อกรวมทุกจุดเช่า
            </p>
            <SizeInventory
              inventory={aggregatedInventory}
              sizes={product.sizes}
              unit={product.sizeUnit}
              compact
            />
          </div>

          <Link
            href={`/map?product=${product.id}`}
            className="mt-auto inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 sm:w-auto"
          >
            หาจุดเช่าใกล้ฉัน
          </Link>
        </div>
      </div>

      {!compact && (
        <div className="mt-4 flex flex-wrap gap-2">
          {product.activities.map((activity) => (
            <span
              key={activity}
              className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
            >
              {activity}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3">
        <CollapsibleSection title="รายละเอียดเพิ่มเติม" defaultOpen={!compact}>
          {!compact && (
            <p className="mb-4 text-sm leading-relaxed text-zinc-600">
              {product.longDescription}
            </p>
          )}
          <dl className="mb-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-zinc-50 p-3">
              <dt className="text-xs text-zinc-500">สี</dt>
              <dd className="font-medium text-zinc-900">{product.color}</dd>
            </div>
            <div className="rounded-lg bg-zinc-50 p-3">
              <dt className="text-xs text-zinc-500">วัสดุ</dt>
              <dd className="font-medium text-zinc-900">{product.material}</dd>
            </div>
          </dl>
          <ul className="space-y-1.5">
            {product.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 text-sm text-zinc-600"
              >
                <span className="mt-0.5 text-emerald-500">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </CollapsibleSection>

        <CollapsibleSection title="ตารางไซส์">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[280px] text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left">
                  <th className="pb-2 font-semibold text-zinc-700">
                    {isShoe ? "ไซส์ EU" : "ไซส์"}
                  </th>
                  {isShoe ? (
                    <th className="pb-2 font-semibold text-zinc-700">ความยาวเท้า</th>
                  ) : (
                    <>
                      {hasChest && (
                        <th className="pb-2 font-semibold text-zinc-700">รอบอก</th>
                      )}
                      {hasWaist && (
                        <th className="pb-2 font-semibold text-zinc-700">รอบเอว</th>
                      )}
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {product.sizeGuide.map((row) => (
                  <tr key={row.size} className="border-b border-zinc-100 last:border-0">
                    <td className="py-2 font-semibold text-zinc-900">{row.size}</td>
                    {isShoe ? (
                      <td className="py-2 text-zinc-600">{row.footLength ?? "—"}</td>
                    ) : (
                      <>
                        {hasChest && (
                          <td className="py-2 text-zinc-600">{row.chest ?? "—"}</td>
                        )}
                        {hasWaist && (
                          <td className="py-2 text-zinc-600">{row.waist ?? "—"}</td>
                        )}
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="มาตรฐานความสะอาด">
          <p className="text-sm leading-relaxed text-zinc-600">{product.careNote}</p>
        </CollapsibleSection>

        {!compact && (
          <CollapsibleSection title={`จุดเช่าที่มีสินค้านี้ (${availability.length})`}>
            <ProductAvailabilityList items={availability} productId={product.id} />
          </CollapsibleSection>
        )}

        {!compact && related.length > 0 && (
          <CollapsibleSection title="สินค้าอื่นที่น่าสนใจ">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.id}`}
                  className="group rounded-xl border border-zinc-100 bg-zinc-50 p-3 transition-shadow hover:shadow-md"
                >
                  <div className="relative mb-2 aspect-square overflow-hidden rounded-lg bg-white">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                      sizes="120px"
                    />
                  </div>
                  <p className="truncate text-xs font-medium text-zinc-900">
                    {item.name}
                  </p>
                  <p className="text-xs font-semibold text-emerald-600">
                    ฿{item.pricePerRental}/ครั้ง
                  </p>
                </Link>
              ))}
            </div>
          </CollapsibleSection>
        )}
      </div>
    </main>
  );
}
