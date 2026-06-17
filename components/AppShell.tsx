"use client";

import { usePathname } from "next/navigation";
import { isAuthRoute } from "@/lib/navigation";
import MobileTabBar from "./MobileTabBar";
import Navbar from "./Navbar";

export default function AppShell({
  children,
  activeRentalCount = 0,
}: {
  children: React.ReactNode;
  activeRentalCount?: number;
}) {
  const pathname = usePathname();
  const hideChrome = isAuthRoute(pathname);

  return (
    <>
      <Navbar activeRentalCount={activeRentalCount} />
      <div
        className={`flex min-h-0 flex-1 flex-col overflow-x-hidden ${
          hideChrome
            ? ""
            : "pb-[calc(7rem+env(safe-area-inset-bottom,0px))] md:pb-0"
        }`}
      >
        {children}
      </div>
      <MobileTabBar />
    </>
  );
}
