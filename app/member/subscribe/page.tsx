import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SubscriptionPlanPicker from "@/components/SubscriptionPlanPicker";
import { auth } from "@/auth";
import { getTranslator } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return {
    title: t("meta.subscribeTitle"),
    description: t("meta.subscribeDescription"),
  };
}

export default async function SubscribePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent("/member/subscribe")}`);
  }

  return (
    <main className="relative flex-1 overflow-x-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-linear-to-b from-violet-50/80 to-transparent" />
      <div className="relative mx-auto w-full max-w-md flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <SubscriptionPlanPicker />
      </div>
    </main>
  );
}
