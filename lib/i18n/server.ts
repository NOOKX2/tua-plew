import "server-only";

import { cookies } from "next/headers";
import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_COOKIE,
  type Locale,
} from "./config";
import { createTranslator } from "./translate";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return value && isLocale(value) ? value : DEFAULT_LOCALE;
}

export async function getTranslator() {
  const locale = await getLocale();
  return createTranslator(locale);
}

export function getLocaleFromRequest(request: Request): Locale {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(new RegExp(`${LOCALE_COOKIE}=([^;]+)`));
  const value = match?.[1];
  return value && isLocale(value) ? value : DEFAULT_LOCALE;
}

export function getTranslatorFromRequest(request: Request) {
  return createTranslator(getLocaleFromRequest(request));
}
