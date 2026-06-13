"use client";

import { useLocale } from "@/lib/i18n/client";
import type { Locale } from "@/lib/i18n/config";
import { LOCALES } from "@/lib/i18n/config";

const LABELS: Record<Locale, string> = {
  th: "ไทย",
  en: "EN",
};

export default function LanguageSwitcher() {
  const { locale, setLocale, isPending, t } = useLocale();

  return (
    <div
      className="flex items-center rounded-lg border border-zinc-200 bg-white p-0.5 text-xs font-medium"
      role="group"
      aria-label={t("lang.switch")}
    >
      {LOCALES.map((code) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            disabled={isPending}
            onClick={() => setLocale(code)}
            aria-pressed={active}
            className={`rounded-md px-2 py-1 transition-colors ${
              active
                ? "bg-emerald-600 text-white"
                : "text-zinc-600 hover:bg-zinc-50 hover:text-emerald-600"
            } disabled:opacity-60`}
          >
            {LABELS[code]}
          </button>
        );
      })}
    </div>
  );
}
