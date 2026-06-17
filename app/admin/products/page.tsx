import AdminEntityList from "@/components/admin/AdminEntityList";
import { CATEGORY_LABELS } from "@/lib/types";
import { listAdminProducts } from "@/lib/admin/catalog.server";

export default async function AdminProductsPage() {
  const products = await listAdminProducts();

  return (
    <AdminEntityList
      title="จัดการเสื้อผ้า"
      description="แก้ไขรายการสินค้าเช่าทั้งหมดในแคตตาล็อก"
      newHref="/admin/products/new"
      newLabel="+ เพิ่มสินค้า"
      emptyLabel="ยังไม่มีสินค้า — กดเพิ่มสินค้าเพื่อเริ่มต้น"
      items={products.map((product) => ({
        id: product.id,
        title: product.name,
        subtitle: product.description,
        meta: `${CATEGORY_LABELS[product.category]} · ฿${product.pricePerRental}`,
      }))}
    />
  );
}
