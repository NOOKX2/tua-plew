"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "@/lib/i18n/client";

export default function MemberTopUpSuccessBanner() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const topup = searchParams.get("topup");
    const balance = searchParams.get("balance");
    if (!topup || !balance) return;

    const amount = Number(topup);
    const newBalance = Number(balance);
    if (!Number.isFinite(amount) || !Number.isFinite(newBalance)) return;

    setMessage(
      t("rental.tokens.topUpSuccess", {
        amount,
        balance: newBalance,
      }),
    );
    setVisible(true);

    const url = new URL(window.location.href);
    url.searchParams.delete("topup");
    url.searchParams.delete("balance");
    window.history.replaceState({}, "", url.pathname);
  }, [searchParams, t]);

  if (!visible) return null;

  return (
    <div className="mb-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 ring-1 ring-emerald-100">
      {message}
    </div>
  );
}
