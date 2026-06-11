import Link from "next/link";

type Props = {
  backHref?: string;
  backLabel?: string;
};

export default function SiteHeader({
  backHref = "/",
  backLabel = "กลับหน้าหลัก",
}: Props) {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-lg font-bold text-emerald-600">
          Fit-to-Go
        </Link>
        <Link
          href={backHref}
          className="text-sm font-medium text-zinc-600 transition-colors hover:text-emerald-600"
        >
          ← {backLabel}
        </Link>
      </div>
    </header>
  );
}
