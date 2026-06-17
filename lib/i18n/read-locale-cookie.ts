import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, type Locale } from "./config";

export function readLocaleCookie(): Locale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`),
  );
  const value = match?.[1] ? decodeURIComponent(match[1]) : "";
  return value && isLocale(value) ? value : DEFAULT_LOCALE;
}
