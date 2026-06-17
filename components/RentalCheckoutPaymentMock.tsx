"use client";

import { useState } from "react";
import { CreditCard, QrCode, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslations } from "@/lib/i18n/client";

type PaymentMethod = "credit" | "debit" | "qr";

type Option = {
  id: PaymentMethod;
  labelKey: "creditCard" | "debitCard" | "qrCode";
  icon: LucideIcon;
};

const OPTIONS: Option[] = [
  { id: "credit", labelKey: "creditCard", icon: CreditCard },
  { id: "debit", labelKey: "debitCard", icon: Wallet },
  { id: "qr", labelKey: "qrCode", icon: QrCode },
];

type Props = {
  amount: number;
};

export default function RentalCheckoutPaymentMock({ amount }: Props) {
  const t = useTranslations();
  const [method, setMethod] = useState<PaymentMethod>("credit");
  const [demoPaid, setDemoPaid] = useState(false);

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200/80">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
            {t("rental.checkout.payment.title")}
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            {t("rental.checkout.payment.mockNote")}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700 ring-1 ring-amber-100">
          Demo
        </span>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {OPTIONS.map((option) => {
          const Icon = option.icon;
          const selected = method === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                setMethod(option.id);
                setDemoPaid(false);
              }}
              className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-left text-sm font-semibold transition-colors ${
                selected
                  ? "border-blue-600 bg-blue-50 text-blue-800 ring-1 ring-blue-600/20"
                  : "border-zinc-200 bg-zinc-50/50 text-zinc-700 hover:border-zinc-300 hover:bg-white"
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  selected
                    ? "bg-blue-600 text-white"
                    : "bg-white text-zinc-500 ring-1 ring-zinc-200"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </span>
              <span className="min-w-0 leading-tight">
                {t(`rental.checkout.payment.${option.labelKey}`)}
              </span>
            </button>
          );
        })}
      </div>

      {method === "qr" ? (
        <div className="mt-5 rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 p-5 text-center">
          <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200">
            <MockQrCode />
          </div>
          <p className="mt-4 text-sm font-medium text-zinc-800">
            {t("rental.checkout.payment.qrInstruction")}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {t("rental.checkout.payment.qrAmount")}: ฿{amount}
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
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

      <button
        type="button"
        onClick={() => setDemoPaid(true)}
        disabled={demoPaid}
        className="mt-5 flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-colors hover:bg-blue-500 disabled:cursor-default disabled:bg-emerald-600 disabled:shadow-emerald-600/20"
      >
        {demoPaid
          ? t("rental.checkout.payment.paidDemo")
          : t("rental.checkout.payment.payButton", { amount })}
      </button>
    </section>
  );
}

function MockQrCode() {
  const cells = 11;
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
    <svg viewBox={`0 0 ${cells} ${cells}`} className="h-32 w-32" aria-hidden>
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
