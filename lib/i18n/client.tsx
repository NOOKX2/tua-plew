"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { DEFAULT_LOCALE, type Locale } from "./config";
import { readLocaleCookie } from "./read-locale-cookie";
import type { Messages } from "./translate";
import { createTranslator, getMessages, t as translate } from "./translate";
import { setLocaleAction } from "@/lib/actions/locale";

type LocaleContextValue = {
  locale: Locale;
  messages: Messages;
  t: ReturnType<typeof createTranslator>;
  setLocale: (locale: Locale) => void;
  isPending: boolean;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setLocaleState(readLocaleCookie());
  }, []);

  const messages = useMemo(() => getMessages(locale), [locale]);

  const translator = useMemo(
    () => createTranslator(locale),
    [locale, messages],
  );

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      startTransition(async () => {
        await setLocaleAction(next);
        setLocaleState(next);
      });
    },
    [locale],
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
