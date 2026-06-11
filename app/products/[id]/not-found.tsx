import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

export default function ProductNotFound() {
  return (
    <div className="flex min-h-full flex-col bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <p className="mb-2 text-5xl">👕</p>
        <h1 className="mb-2 text-xl font-bold text-zinc-900">ไม่พบสินค้า</h1>
        <p className="mb-6 text-sm text-zinc-500">
          สินค้าที่คุณค้นหาอาจถูกลบหรือไม่มีในระบบ
        </p>
        <Link
          href="/"
          className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          กลับหน้าหลัก
        </Link>
      </main>
    </div>
  );
}
