export const LOCALES = ["th", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "th";
export const LOCALE_COOKIE = "locale";

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function localeTag(locale: Locale): string {
  return locale === "th" ? "th-TH" : "en-US";
}
