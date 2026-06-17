"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslations } from "@/lib/i18n/client";

export type CheckoutPaymentMethod = "promptpay" | "card";

type Props = {
  backHref: string;
  backLabel: string;
  title: string;
  subtitle: string;
  orderTitle: string;
  orderSubtitle?: string;
  amount: number;
  demoNote: string;
  payButtonLabel: string;
  loadingLabel: string;
  onPay: (method: CheckoutPaymentMethod) => Promise<{ ok: true } | { ok: false; error: string }>;
};

export default function PaymentMethodCheckout({
  backHref,
  backLabel,
  title,
  subtitle,
  orderTitle,
  orderSubtitle,
  amount,
  demoNote,
  payButtonLabel,
  loadingLabel,
  onPay,
}: Props) {
  const t = useTranslations();
  const [method, setMethod] = useState<CheckoutPaymentMethod | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const methods: {
    id: CheckoutPaymentMethod;
    title: string;
    subtitle: string;
    icon: LucideIcon;
    iconClass: string;
    recommended?: boolean;
  }[] = [
    {
      id: "promptpay",
      title: t("rental.tokens.payment.promptpay"),
      subtitle: t("rental.tokens.payment.promptpayHint"),
      icon: Building2,
      iconClass: "bg-emerald-50 text-emerald-700",
      recommended: true,
    },
    {
      id: "card",
      title: t("rental.tokens.payment.card"),
      subtitle: t("rental.tokens.payment.cardHint"),
      icon: CreditCard,
      iconClass: "bg-blue-50 text-blue-700",
    },
  ];

  async function handlePay() {
    if (!method) return;

    setLoading(true);
    setError(null);

    const result = await onPay(method);

    setLoading(false);

    if (!result.ok) {
      setError(result.error);
    }
  }

  return (
    <div className="space-y-5">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-800"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        {backLabel}
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{title}</h1>
        <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
      </div>

      <div className="rounded-2xl bg-zinc-100/90 px-4 py-3.5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-900">{orderTitle}</p>
            {orderSubtitle ? (
              <p className="mt-0.5 text-xs text-zinc-500">{orderSubtitle}</p>
            ) : null}
          </div>
          <p className="shrink-0 text-lg font-bold text-zinc-900">฿{amount}</p>
        </div>
      </div>

      <div className="space-y-2">
        {methods.map((item) => {
          const selected = method === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setMethod(item.id)}
              className={`flex w-full items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 text-left transition-colors ${
                selected
                  ? "border-blue-600 ring-2 ring-blue-600/15"
                  : "border-zinc-200 hover:border-zinc-300"
              }`}
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.iconClass}`}
              >
                <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-zinc-900">{item.title}</span>
                  {item.recommended && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                      {t("rental.tokens.payment.recommended")}
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block text-xs text-zinc-500">
                  {item.subtitle}
                </span>
              </span>
              <ChevronRight
                className={`h-4 w-4 shrink-0 text-zinc-300 ${selected ? "text-blue-600" : ""}`}
                aria-hidden
              />
            </button>
          );
        })}
      </div>

      {method === "promptpay" && (
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/80 p-5 text-center">
          <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200">
            <MockQrCode />
          </div>
          <p className="mt-4 text-sm font-medium text-zinc-800">
            {t("rental.tokens.payment.scanPromptpay")}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {t("rental.checkout.payment.qrAmount")}: ฿{amount}
          </p>
        </div>
      )}

      {method === "card" && (
        <div className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-zinc-500">
              {t("rental.checkout.payment.cardNumber")}
            </span>
            <input
              type="text"
              readOnly
              value="4242 4242 4242 4242"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 font-mono text-sm text-zinc-600"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-zinc-500">
                {t("rental.checkout.payment.expiry")}
              </span>
              <input
                type="text"
                readOnly
                value="12/28"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 font-mono text-sm text-zinc-600"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-zinc-500">
                {t("rental.checkout.payment.cvv")}
              </span>
              <input
                type="text"
                readOnly
                value="•••"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 font-mono text-sm text-zinc-600"
              />
            </label>
          </div>
        </div>
      )}

      <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-emerald-700">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
        {t("rental.tokens.payment.secureNote")}
      </p>

      <button
        type="button"
        disabled={!method || loading}
        onClick={handlePay}
        className="flex w-full items-center justify-center rounded-2xl bg-zinc-900 px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? loadingLabel : payButtonLabel}
      </button>

      <p className="text-center text-[11px] text-zinc-400">{demoNote}</p>

      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-center text-xs font-medium text-red-700 ring-1 ring-red-100">
          {error}
        </p>
      )}
    </div>
  );
}

function MockQrCode() {
  const pattern = [
    [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1],
    [0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0],
    [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1],
    [0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0],
    [1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1],
  ];

  return (
    <svg viewBox="0 0 11 11" className="h-32 w-32" aria-hidden>
      {pattern.flatMap((row, y) =>
        row.map((filled, x) =>
          filled ? (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              className="fill-zinc-900"
            />
          ) : null,
        ),
      )}
    </svg>
  );
}
