"use client";

import { LocaleProvider } from "@/lib/i18n/client";
import { UserProvider } from "./UserProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <UserProvider>{children}</UserProvider>
    </LocaleProvider>
  );
}
