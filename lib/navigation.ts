export type NavMessageKey =
  | "nav.home"
  | "nav.community"
  | "nav.campaigns"
  | "nav.rental";

export type MainNavItem = {
  href: string;
  messageKey: NavMessageKey;
  match: (path: string) => boolean;
};

export const mainNavItems: MainNavItem[] = [
  {
    href: "/",
    messageKey: "nav.home",
    match: (path) => path === "/",
  },
  {
    href: "/community",
    messageKey: "nav.community",
    match: (path) => path.startsWith("/community"),
  },
  {
    href: "/campaigns",
    messageKey: "nav.campaigns",
    match: (path) => path.startsWith("/campaigns"),
  },
  {
    href: "/map",
    messageKey: "nav.rental",
    match: (path) => path === "/map" || path.startsWith("/products"),
  },
];

export function isAuthRoute(pathname: string) {
  return pathname === "/login" || pathname === "/register";
}
