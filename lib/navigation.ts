export type NavMessageKey =
  | "nav.home"
  | "nav.community"
  | "nav.chat"
  | "nav.campaigns"
  | "nav.rental";

export type MainNavItem = {
  href: string;
  messageKey: NavMessageKey;
  match: (path: string) => boolean;
};

function isCommunityChatPath(path: string) {
  return (
    path.startsWith("/community/messages") ||
    /\/community\/[^/]+\/chat$/.test(path)
  );
}

export const mainNavItems: MainNavItem[] = [
  {
    href: "/",
    messageKey: "nav.home",
    match: (path) => path === "/",
  },
  {
    href: "/community",
    messageKey: "nav.community",
    match: (path) =>
      path.startsWith("/community") && !isCommunityChatPath(path),
  },
  {
    href: "/chat",
    messageKey: "nav.chat",
    match: (path) => path.startsWith("/chat") || isCommunityChatPath(path),
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
