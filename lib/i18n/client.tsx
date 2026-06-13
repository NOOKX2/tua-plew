"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "./config";
import type { Messages } from "./translate";
import { createTranslator, t as translate } from "./translate";

type LocaleContextValue = {
  locale: Locale;
  messages: Messages;
  t: ReturnType<typeof createTranslator>;
  setLocale: (locale: Locale) => void;
  isPending: boolean;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const translator = useMemo(
    () => createTranslator(locale),
    [locale, messages],
  );

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      startTransition(async () => {
        await fetch("/api/locale", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locale: next }),
        });
        router.refresh();
      });
    },
    [locale, router],
  );

  const value = useMemo(
    () => ({
      locale,
      messages,
      t: translator,
      setLocale,
      isPending,
    }),
    [locale, messages, translator, setLocale, isPending],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}

export function useTranslations() {
  return useLocale().t;
}

export { translate };
