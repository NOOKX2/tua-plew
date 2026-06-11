import Image from "next/image";
import Link from "next/link";
import type {
  LocationProductStock,
  Product,
  SizeInventory as SizeInventoryType,
} from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { getStockTotal } from "@/lib/locations";
import SizeInventory from "./SizeInventory";
import StockBadge from "./StockBadge";

type Props = {
  product: Product;
  stock?: LocationProductStock;
  globalInventory?: SizeInventoryType;
  variant?: "catalog" | "location";
  selected?: boolean;
};

export default function ProductCard({
  product,
  stock,
  globalInventory,
  variant = "catalog",
  selected,
}: Props) {
  const locationTotal = stock ? getStockTotal(stock.inventory) : null;
  const globalTotal = globalInventory
    ? getStockTotal(globalInventory)
    : null;
  const displayInventory = stock?.inventory ?? globalInventory;
  const displayTotal = locationTotal ?? globalTotal;
  const isCatalog = variant === "catalog";

  const content = (
    <div className={isCatalog ? "flex flex-col" : "flex gap-4 p-4"}>
      <div
        className={
          isCatalog
            ? "relative aspect-square w-full overflow-hidden rounded-t-2xl bg-zinc-50"
            : "relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-zinc-50 sm:h-32 sm:w-32"
        }
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-4"
          sizes={isCatalog ? "(max-width: 768px) 50vw, 25vw" : "128px"}
        />
        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 shadow-sm backdrop-blur-sm">
          {CATEGORY_LABELS[product.category]}
        </span>
        {displayTotal !== null && isCatalog && (
          <div className="absolute bottom-2 right-2">
            <StockBadge
              total={displayTotal}
              unit={product.sizeUnit}
              size="sm"
            />
          </div>
        )}
      </div>

      <div
        className={
          isCatalog
            ? "flex flex-1 flex-col p-4"
            : "flex min-w-0 flex-1 flex-col"
        }
      >
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="font-semibold text-zinc-900">
            {isCatalog ? (
              product.name
            ) : (
              <Link
                href={`/products/${product.id}`}
                className="hover:text-emerald-600 hover:underline"
              >
                {product.name}
              </Link>
            )}
          </h3>
          {displayTotal !== null && !isCatalog && (
            <StockBadge
              total={displayTotal}
              unit={product.sizeUnit}
              size="sm"
            />
          )}
        </div>

        <p className="mb-2 line-clamp-2 text-xs text-zinc-500">
          {product.description}
        </p>

        <div className="mb-3 flex flex-wrap gap-2 text-[11px] text-zinc-500">
          <span className="rounded-md bg-zinc-100 px-2 py-0.5">
            สี {product.color}
          </span>
          <span className="rounded-md bg-zinc-100 px-2 py-0.5">
            {product.material}
          </span>
        </div>

        {displayInventory && (
          <div className={isCatalog ? "mb-3" : "mb-3 border-t border-zinc-100 pt-3"}>
            <p className="mb-2 text-xs font-medium text-zinc-600">
              {isCatalog
                ? `เหลือกี่${product.sizeUnit} (แต่ละไซส์)`
                : "สต็อกคงเหลือตามไซส์"}
            </p>
            <SizeInventory
              inventory={displayInventory}
              sizes={product.sizes}
              unit={product.sizeUnit}
              compact={isCatalog}
            />
          </div>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <p className="text-sm font-bold text-emerald-600">
            ฿{product.pricePerRental}
            <span className="text-xs font-normal text-zinc-500"> /ครั้ง</span>
          </p>
          {isCatalog && (
            <span className="text-xs font-medium text-emerald-600">
              ดูรายละเอียด →
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (isCatalog) {
    return (
      <Link
        href={`/products/${product.id}`}
        className={`block rounded-2xl border bg-white transition-all hover:border-emerald-300 hover:shadow-md ${
          selected
            ? "border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
            : "border-zinc-200"
        }`}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
      {content}
    </div>
  );
}
