import Image from "next/image";
import Link from "next/link";
import type { CommunityEvent, Product, RentalLocation } from "@/lib/types";
import {
  ACTIVITY_EMOJI,
  ACTIVITY_LABELS,
  DIFFICULTY_LABELS,
  formatEventDate,
  formatEventTime,
  spotsLeft,
} from "@/lib/community";
import { getAggregatedProductInventory, getStockTotal } from "@/lib/locations";
import { getProductById } from "@/lib/products";
import StockBadge from "./StockBadge";

type Props = {
  event: CommunityEvent;
  location: RentalLocation | undefined;
  locations: RentalLocation[];
  products: Product[];
};

export default function CommunityDetail({
  event,
  location,
  locations,
  products,
}: Props) {
  const recommended = event.recommendedProductIds
    .map((id) => getProductById(id, products))
    .filter((product) => product !== undefined);

  const remaining = spotsLeft(event);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8">
      <div className="relative mb-6 overflow-hidden rounded-2xl">
        <div className="relative aspect-[21/9] w-full sm:aspect-[2.5/1]">
          <Image
            src={event.image}
            alt={event.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white sm:p-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">
              {ACTIVITY_EMOJI[event.activityType]}{" "}
              {ACTIVITY_LABELS[event.activityType]}
            </span>
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm backdrop-blur-sm">
              {DIFFICULTY_LABELS[event.difficulty]}
            </span>
          </div>
          <h1 className="mb-2 text-2xl font-bold drop-shadow-sm sm:text-3xl">
            {event.title}
          </h1>
          <p className="text-white/90">{event.shortDescription}</p>
        </div>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs font-medium text-zinc-500">วันและเวลา</p>
          <p className="mt-1 font-semibold text-zinc-900">
            {formatEventDate(event.date)}
          </p>
          <p className="text-sm text-zinc-600">
            {formatEventTime(event.startTime, event.endTime)}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs font-medium text-zinc-500">ผู้เข้าร่วม</p>
          <p className="mt-1 font-semibold text-zinc-900">
            {event.participantCount}
            {event.maxParticipants ? ` / ${event.maxParticipants}` : ""} คน
          </p>
          {remaining !== null && (
            <p className="text-sm text-zinc-600">เหลือ {remaining} ที่ว่าง</p>
          )}
        </div>
      </div>

      <section className="mb-6 rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="mb-2 text-sm font-semibold text-zinc-900">รายละเอียด</h2>
        <p className="text-sm leading-relaxed text-zinc-600">
          {event.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section className="mb-6 rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="mb-1 text-sm font-semibold text-zinc-900">สถานที่</h2>
        <p className="font-medium text-zinc-900">{event.venue}</p>
        <p className="text-sm text-zinc-500">{event.address}</p>
        <p className="mt-2 text-xs text-zinc-400">
          จัดโดย {event.organizer}
        </p>
      </section>

      {location && (
        <section className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
          <h2 className="mb-1 text-sm font-semibold text-emerald-800">
            จุดเช่าชุดกีฬาใกล้กิจกรรม
          </h2>
          <p className="font-medium text-zinc-900">{location.name}</p>
          <p className="mb-3 text-sm text-zinc-600">{location.address}</p>
          <p className="mb-3 text-xs text-emerald-700">
            เปิด {location.openHours} · เช่าชุดก่อนเข้าร่วมกิจกรรมได้เลย
          </p>
          <Link
            href={`/map?product=${recommended[0]?.id ?? ""}`}
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            หาจุดเช่าใกล้กิจกรรม →
          </Link>
        </section>
      )}

      {recommended.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-1 text-lg font-bold text-zinc-900">
            ชุดแนะนำสำหรับกิจกรรมนี้
          </h2>
          <p className="mb-4 text-sm text-zinc-500">
            เช่าชุดกีฬาสะอาดก่อนออกกำลังกาย — ไม่ต้องซื้อ ไม่ต้องซักเอง
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {recommended.map((product) => {
              const total = getStockTotal(
                getAggregatedProductInventory(product.id, locations, products),
              );
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="flex gap-3 rounded-xl border border-zinc-200 bg-white p-3 transition-shadow hover:shadow-md"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-50">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-1.5"
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-zinc-900">
                      {product.name}
                    </p>
                    <p className="text-xs font-bold text-emerald-600">
                      ฿{product.pricePerRental}/ครั้ง
                    </p>
                    <StockBadge
                      total={total}
                      unit={product.sizeUnit}
                      size="sm"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
