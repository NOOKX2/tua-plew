import Link from "next/link";
import AuthButton from "./AuthButton";

type Props = {
  backHref?: string;
  backLabel?: string;
  showAuth?: boolean;
};

export default function SiteHeader({
  backHref = "/",
  backLabel = "กลับหน้าหลัก",
  showAuth = true,
}: Props) {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="shrink-0 text-lg font-bold text-emerald-600">
          Fit-to-Go
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={backHref}
            className={`text-sm font-medium text-zinc-600 transition-colors hover:text-emerald-600 ${
              showAuth ? "hidden sm:inline" : ""
            }`}
          >
            ← {backLabel}
          </Link>
          {showAuth && <AuthButton />}
        </div>
      </div>
    </header>
  );
}
