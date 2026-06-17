const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function parseSlug(value: string): string | null {
  const slug = value.trim().toLowerCase();
  return SLUG_RE.test(slug) ? slug : null;
}

export function parseLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function parseCommaList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseOptionalNumber(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : undefined;
}

export function parseRequiredNumber(value: string): number | null {
  const num = Number(value.trim());
  return Number.isFinite(num) ? num : null;
}

export function parseJsonArray<T>(value: string): T[] | null {
  const trimmed = value.trim();
  if (!trimmed) return [];
  try {
    const parsed = JSON.parse(trimmed) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : null;
  } catch {
    return null;
  }
}

export function linesFromArray(values: string[] | undefined): string {
  return (values ?? []).join("\n");
}

export function commaFromArray(values: string[] | undefined): string {
  return (values ?? []).join(", ");
}

export function jsonFromArray(values: unknown[] | undefined): string {
  return JSON.stringify(values ?? [], null, 2);
}
