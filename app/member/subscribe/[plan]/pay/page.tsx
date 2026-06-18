import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import SubscriptionPaymentView from "@/components/SubscriptionPaymentView";
import { auth } from "@/auth";
import { getTranslator } from "@/lib/i18n/server";
import {
  getSubscriptionPlan,
  parseSubscriptionPlan,
} from "@/lib/subscription-plans";

type Props = {
  params: Promise<{ plan: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { plan: planParam } = await params;
  const t = await getTranslator();
  const planId = parseSubscriptionPlan(planParam);

  return {
    title: planId
      ? t("subscription.payment.metaTitle", {
          plan: t(`subscription.plans.${planId}.name`),
        })
      : t("meta.subscribeTitle"),
  };
}

export default async function SubscribePaymentPage({ params }: Props) {
  const { plan: planParam } = await params;
  const planId = parseSubscriptionPlan(planParam);

  if (!planId) notFound();

  const session = await auth();
  if (!session?.user?.id) {
    redirect(
      `/login?callbackUrl=${encodeURIComponent(`/member/subscribe/${planId}/pay`)}`,
    );
  }

  void getSubscriptionPlan(planId);

  return (
    <main className="relative flex-1 overflow-x-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-linear-to-b from-violet-50/80 to-transparent" />
      <div className="relative mx-auto w-full max-w-md flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <SubscriptionPaymentView planId={planId} />
      </div>
    </main>
  );
}
