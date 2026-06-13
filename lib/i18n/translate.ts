import type { Locale } from "./config";
import { th } from "./messages/th";
import type { Messages } from "./messages/en";
import { en } from "./messages/en";

export type { Messages };

const catalogs: Record<Locale, Messages> = { th, en };

export function getMessages(locale: Locale): Messages {
  return catalogs[locale];
}

export function createTranslator(locale: Locale) {
  const messages = getMessages(locale);
  return (key: string, vars?: Record<string, string | number>) =>
    t(messages, key, vars);
}

export function t(
  messages: Messages,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const keys = key.split(".");
  let value: unknown = messages;

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }

  if (typeof value !== "string") return key;
  if (!vars) return value;

  return Object.entries(vars).reduce(
    (result, [name, val]) =>
      result.replace(new RegExp(`\\{${name}\\}`, "g"), String(val)),
    value,
  );
}
