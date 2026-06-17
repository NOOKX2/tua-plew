import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import TokenTopUpPaymentView from "@/components/TokenTopUpPaymentView";
import { auth } from "@/auth";
import { getTranslator } from "@/lib/i18n/server";
import { parseTopUpPackage } from "@/lib/top-up-packages";

type Props = {
  params: Promise<{ amount: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { amount } = await params;
  const t = await getTranslator();
  const pkg = parseTopUpPackage(amount);

  return {
    title: pkg
      ? t("rental.tokens.payment.metaTitle", { amount: pkg })
      : t("meta.memberTitle"),
  };
}

export default async function TokenTopUpPaymentPage({ params }: Props) {
  const { amount } = await params;
  const pkg = parseTopUpPackage(amount);

  if (!pkg) notFound();

  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/member/tokens/top-up/${pkg}`)}`);
  }

  return (
    <main className="relative flex-1 overflow-x-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-linear-to-b from-blue-50/80 to-transparent" />
      <div className="relative mx-auto w-full max-w-md flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <TokenTopUpPaymentView amount={pkg} />
      </div>
    </main>
  );
}
