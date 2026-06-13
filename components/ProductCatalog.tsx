import type { Product, RentalLocation } from "@/lib/types";
import { getAggregatedProductInventory } from "@/lib/locations";
import ProductCard from "./ProductCard";

type Props = {
  products: Product[];
  locations: RentalLocation[];
};

export default function ProductCatalog({ products, locations }: Props) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-zinc-900 sm:text-2xl">
          สินค้าให้เช่า
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          ดูจำนวนเสื้อที่เหลือแต่ละไซส์แบบเรียลไทม์ — คลิกสินค้าเพื่อดูรายละเอียดเพิ่มเติม
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            variant="catalog"
            globalInventory={getAggregatedProductInventory(product.id, locations)}
          />
        ))}
      </div>
    </section>
  );
}
