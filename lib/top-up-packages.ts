export const TOP_UP_PACKAGES = [50, 100, 200] as const;

export type TopUpPackage = (typeof TOP_UP_PACKAGES)[number];

export function parseTopUpPackage(value: string): TopUpPackage | null {
  const amount = Number(value);
  if (!TOP_UP_PACKAGES.includes(amount as TopUpPackage)) return null;
  return amount as TopUpPackage;
}
