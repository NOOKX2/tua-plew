import type { RentalTokenTransaction } from "@/lib/types";

export function formatTokenTransactionDate(
  iso: string,
  locale: "th" | "en",
) {
  return new Date(iso).toLocaleDateString(locale === "th" ? "th-TH" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTokenTransactionDateShort(
  iso: string,
  locale: "th" | "en",
) {
  return new Date(iso).toLocaleDateString(locale === "th" ? "th-TH" : "en-US", {
    month: "short",
    day: "numeric",
  });
}

export type TokenTransactionType = RentalTokenTransaction["type"];
