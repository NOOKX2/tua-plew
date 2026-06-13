"use client";

import { SessionProvider } from "next-auth/react";
import { LocaleProvider } from "@/lib/i18n/client";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/translate";

export default function Providers({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  const messages = getMessages(locale);

  return (
    <SessionProvider>
      <LocaleProvider locale={locale} messages={messages}>
        {children}
      </LocaleProvider>
    </SessionProvider>
  );
}
