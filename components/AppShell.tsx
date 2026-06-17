"use client";

import { usePathname } from "next/navigation";
import { isAuthRoute, isAdminRoute } from "@/lib/navigation";
import MobileTabBar from "./MobileTabBar";
import Navbar from "./Navbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome = isAuthRoute(pathname) || isAdminRoute(pathname);

  return (
    <>
      <Navbar />
      <div
        className={`flex min-h-0 flex-1 flex-col overflow-x-hidden ${
          hideChrome
            ? ""
            : "pb-[calc(7rem+env(safe-area-inset-bottom,0px))] md:pb-0"
        }`}
      >
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </div>
      <MobileTabBar />
    </>
  );
}
