import { notFound } from "next/navigation";
import ProductAdminForm from "@/components/admin/ProductAdminForm";
import { getAdminProduct } from "@/lib/admin/catalog.server";

export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";

  if (isNew) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold text-zinc-900">เพิ่มสินค้าใหม่</h1>
        <ProductAdminForm isNew />
      </div>
    );
  }

  const product = await getAdminProduct(id);
  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">แก้ไขสินค้า</h1>
      <ProductAdminForm product={product} isNew={false} />
    </div>
  );
}
