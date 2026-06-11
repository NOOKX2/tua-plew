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
import SiteHeader from "./SiteHeader";
import SizeInventory from "./SizeInventory";
import StockBadge from "./StockBadge";

type Props = {
  product: Product;
};

export default function ProductDetail({ product }: Props) {
  const availability = getLocationsWithProduct(product.id);
  const aggregatedInventory = getAggregatedProductInventory(product.id);
  const totalStock = getTotalProductStock(product.id);
  const related = getRelatedProducts(product.id);
  const isShoe = product.category === "shoe";
  const hasWaist = product.sizeGuide.some((row) => row.waist);
  const hasChest = product.sizeGuide.some((row) => row.chest);

  return (
    <div className="flex min-h-full flex-col bg-zinc-50">
      <SiteHeader backHref="/" backLabel="กลับหน้าหลัก" />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-8"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-sm font-semibold text-zinc-700 shadow-sm">
              {CATEGORY_LABELS[product.category]}
            </span>
            <div className="absolute bottom-4 right-4">
              <StockBadge
                total={totalStock}
                unit={product.sizeUnit}
                size="lg"
              />
            </div>
          </div>

          {/* Info */}
          <div>
            <h1 className="mb-2 text-2xl font-bold text-zinc-900 sm:text-3xl">
              {product.name}
            </h1>
            <p className="mb-4 text-sm leading-relaxed text-zinc-600">
              {product.longDescription}
            </p>

            <div className="mb-4 flex flex-wrap items-center gap-3">
              <p className="text-2xl font-bold text-emerald-600">
                ฿{product.pricePerRental}
                <span className="text-base font-normal text-zinc-500">
                  {" "}
                  /ครั้ง
                </span>
              </p>
              <StockBadge
                total={totalStock}
                unit={product.sizeUnit}
                size="md"
              />
            </div>

            <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-4">
              <h2 className="mb-1 text-sm font-semibold text-zinc-900">
                เหลือกี่{product.sizeUnit} (รวมทุกจุดเช่า)
              </h2>
              <p className="mb-3 text-xs text-zinc-500">
                จำนวนคงเหลือแยกตามไซส์ อัปเดตเรียลไทม์
              </p>
              <SizeInventory
                inventory={aggregatedInventory}
                sizes={product.sizes}
                unit={product.sizeUnit}
              />
            </div>

            <dl className="mb-6 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-white p-3 ring-1 ring-zinc-200">
                <dt className="text-xs text-zinc-500">สี</dt>
                <dd className="font-medium text-zinc-900">{product.color}</dd>
              </div>
              <div className="rounded-lg bg-white p-3 ring-1 ring-zinc-200">
                <dt className="text-xs text-zinc-500">วัสดุ</dt>
                <dd className="font-medium text-zinc-900">{product.material}</dd>
              </div>
            </dl>

            <div className="mb-6">
              <h2 className="mb-2 text-sm font-semibold text-zinc-900">
                จุดเด่น
              </h2>
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
            </div>

            <div className="mb-6">
              <h2 className="mb-2 text-sm font-semibold text-zinc-900">
                เหมาะสำหรับ
              </h2>
              <div className="flex flex-wrap gap-2">
                {product.activities.map((activity) => (
                  <span
                    key={activity}
                    className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                  >
                    {activity}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href={`/?product=${product.id}#locations`}
              className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 sm:w-auto"
            >
              หาจุดเช่าใกล้ฉัน
            </Link>
          </div>
        </div>

        {/* Size guide */}
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-zinc-900">
            ตารางไซส์
          </h2>
          <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
            <table className="w-full min-w-[320px] text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-left">
                  <th className="px-4 py-3 font-semibold text-zinc-700">
                    {isShoe ? "ไซส์ EU" : "ไซส์"}
                  </th>
                  {isShoe ? (
                    <th className="px-4 py-3 font-semibold text-zinc-700">
                      ความยาวเท้า
                    </th>
                  ) : (
                    <>
                      {hasChest && (
                        <th className="px-4 py-3 font-semibold text-zinc-700">
                          รอบอก
                        </th>
                      )}
                      {hasWaist && (
                        <th className="px-4 py-3 font-semibold text-zinc-700">
                          รอบเอว
                        </th>
                      )}
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {product.sizeGuide.map((row) => (
                  <tr
                    key={row.size}
                    className="border-b border-zinc-100 last:border-0"
                  >
                    <td className="px-4 py-3 font-semibold text-zinc-900">
                      {row.size}
                    </td>
                    {isShoe ? (
                      <td className="px-4 py-3 text-zinc-600">
                        {row.footLength ?? "—"}
                      </td>
                    ) : (
                      <>
                        {hasChest && (
                          <td className="px-4 py-3 text-zinc-600">
                            {row.chest ?? "—"}
                          </td>
                        )}
                        {hasWaist && (
                          <td className="px-4 py-3 text-zinc-600">
                            {row.waist ?? "—"}
                          </td>
                        )}
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Hygiene */}
        <section className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
          <h2 className="mb-2 text-sm font-semibold text-emerald-800">
            มาตรฐานความสะอาด Fit-to-Go
          </h2>
          <p className="text-sm leading-relaxed text-emerald-900/80">
            {product.careNote}
          </p>
        </section>

        {/* Availability */}
        <section className="mt-10" id="availability">
          <h2 className="mb-4 text-lg font-bold text-zinc-900">
            จุดเช่าที่มีสินค้านี้
          </h2>
          <ProductAvailabilityList
            items={availability}
            productId={product.id}
          />
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-lg font-bold text-zinc-900">
              สินค้าอื่นที่น่าสนใจ
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.id}`}
                  className="group rounded-xl border border-zinc-200 bg-white p-3 transition-shadow hover:shadow-md"
                >
                  <div className="relative mb-2 aspect-square overflow-hidden rounded-lg bg-zinc-50">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-3 transition-transform group-hover:scale-105"
                      sizes="150px"
                    />
                  </div>
                  <p className="truncate text-sm font-medium text-zinc-900">
                    {item.name}
                  </p>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-semibold text-emerald-600">
                      ฿{item.pricePerRental}/ครั้ง
                    </p>
                    <StockBadge
                      total={getTotalProductStock(item.id)}
                      unit={item.sizeUnit}
                      size="sm"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
