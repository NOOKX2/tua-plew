import Link from "next/link";
import { getTranslator } from "@/lib/i18n/server";

export default async function ProductNotFound() {
  const t = await getTranslator();

  return (
    <main className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center bg-zinc-50 px-4 py-16 text-center">
      <p className="mb-2 text-5xl">👕</p>
      <h1 className="mb-2 text-xl font-bold text-zinc-900">
        {t("notFound.productTitle")}
      </h1>
      <p className="mb-6 text-sm text-zinc-500">
        {t("notFound.productDescription")}
      </p>
      <Link
        href="/"
        className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
      >
        {t("notFound.backHome")}
      </Link>
    </main>
  );
}
