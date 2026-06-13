import type { Product, RentalLocation } from "@/lib/types";
import { getAggregatedProductInventory } from "@/lib/locations";
import ProductCard from "./ProductCard";

type Props = {
  products: Product[];
  locations: RentalLocation[];
};

export default function ProductCatalog({ products, locations }: Props) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-zinc-900 sm:text-xl">
          สินค้าให้เช่า
        </h2>
        <p className="mt-0.5 text-xs text-zinc-500 sm:text-sm">
          ดูจำนวนเสื้อที่เหลือแต่ละไซส์แบบเรียลไทม์ — คลิกสินค้าเพื่อดูรายละเอียดเพิ่มเติม
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            variant="catalog"
            globalInventory={getAggregatedProductInventory(
              product.id,
              locations,
              products,
            )}
          />
        ))}
      </div>
    </section>
  );
}
