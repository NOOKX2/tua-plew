"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "@/lib/i18n/client";

export default function MemberSubscribeSuccessBanner() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const subscribed = searchParams.get("subscribed");
    const limit = searchParams.get("limit");
    if (!subscribed || !limit) return;

    const rentalsLimit = Number(limit);
    if (!Number.isFinite(rentalsLimit)) return;

    setMessage(t("subscription.success.body", { limit: rentalsLimit }));
    setVisible(true);

    const url = new URL(window.location.href);
    url.searchParams.delete("subscribed");
    url.searchParams.delete("limit");
    window.history.replaceState({}, "", url.pathname);
  }, [searchParams, t]);

  if (!visible) return null;

  return (
    <div className="mb-5 rounded-2xl bg-violet-50 px-4 py-3 text-sm font-medium text-violet-900 ring-1 ring-violet-100">
      <p className="font-semibold">{t("subscription.success.title")}</p>
      <p className="mt-1">{message}</p>
    </div>
  );
}
