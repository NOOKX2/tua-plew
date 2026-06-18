"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signInWithGoogleAction, signInWithLineAction, signOutAction } from "@/lib/actions/auth-session";
import type { AppSessionUser } from "@/lib/auth-session";
import { useTranslations } from "@/lib/i18n/client";

type Props = {
  variant?: "light" | "dark";
  initialActiveRentals?: number;
  sessionUser?: AppSessionUser | null;
};

export default function AuthButton({
  variant = "dark",
  initialActiveRentals = 0,
  sessionUser = null,
}: Props) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [activeRentals, setActiveRentals] = useState(initialActiveRentals);
  const [signingOut, setSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isLight = variant === "light";

  useEffect(() => {
    setActiveRentals(initialActiveRentals);
  }, [initialActiveRentals]);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  if (sessionUser) {
    return (
      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-haspopup="menu"
          className={`flex items-center gap-2 rounded-lg px-1.5 py-1 transition-colors sm:px-2 ${
            isLight
              ? "hover:bg-white/15"
              : "hover:bg-zinc-100"
          }`}
        >
          {sessionUser.image ? (
            <Image
              src={sessionUser.image}
              alt={sessionUser.name ?? t("common.user")}
              width={32}
              height={32}
              className={`rounded-full ${isLight ? "ring-2 ring-white/30" : "ring-2 ring-zinc-200"}`}
            />
          ) : (
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                isLight
                  ? "bg-white/20 text-white"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {(sessionUser.name ?? "U").charAt(0).toUpperCase()}
            </span>
          )}
          <div className="hidden text-left sm:block">
            <p
              className={`max-w-[120px] truncate text-xs font-medium ${
                isLight ? "text-white" : "text-zinc-800"
              }`}
            >
              {sessionUser.name}
            </p>
            <p
              className={`max-w-[120px] truncate text-[10px] ${
                isLight ? "text-blue-100" : "text-zinc-500"
              }`}
            >
              {sessionUser.email}
            </p>
          </div>
          <svg
            className={`hidden h-3.5 w-3.5 sm:block ${
              isLight ? "text-blue-100" : "text-zinc-400"
            } ${open ? "rotate-180" : ""} transition-transform`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {open && (
          <div
            role="menu"
            className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg"
          >
            <div className="border-b border-zinc-100 px-4 py-3 sm:hidden">
              <p className="truncate text-sm font-medium text-zinc-900">
                {sessionUser.name}
              </p>
              <p className="truncate text-xs text-zinc-500">
                {sessionUser.email}
              </p>
            </div>
            <Link
              href="/rentals"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-zinc-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A9.022 9.022 0 012.43 8.326 9.004 9.004 0 012 5V3.5z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  <span className="block font-medium">{t("rental.myRentals")}</span>
                  {activeRentals > 0 && (
                    <span className="text-xs text-blue-600">
                      {t("rental.activeCount", { count: activeRentals })}
                    </span>
                  )}
                </span>
              </span>
              {activeRentals > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1.5 text-[10px] font-bold text-white">
                  {activeRentals}
                </span>
              )}
            </Link>
            {sessionUser.role === "admin" ? (
              <Link
                href="/admin"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-50"
              >
                <svg
                  className="h-4 w-4 text-zinc-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    d="M11.983 1.907a1 1 0 00-1.966 0l-.757 2.55a7.002 7.002 0 00-2.637 1.529l-2.55-.757a1 1 0 00-1.257 1.257l.757 2.55a7.002 7.002 0 00-1.529 2.637l-2.55.757a1 1 0 000 1.966l2.55.757a7.002 7.002 0 001.529 2.637l-.757 2.55a1 1 0 001.257 1.257l2.55-.757a7.002 7.002 0 002.637 1.529l.757 2.55a1 1 0 001.966 0l.757-2.55a7.002 7.002 0 002.637-1.529l2.55.757a1 1 0 001.257-1.257l-.757-2.55a7.002 7.002 0 001.529-2.637l2.55-.757a1 1 0 000-1.966l-2.55-.757a7.002 7.002 0 00-1.529-2.637l.757-2.55zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
                หลังบ้าน
              </Link>
            ) : null}
            <button
              type="button"
              role="menuitem"
              disabled={signingOut}
              onClick={async () => {
                setOpen(false);
                setSigningOut(true);
                await signOutAction();
              }}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-60"
            >
              <svg
                className="h-4 w-4 text-zinc-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z"
                  clipRule="evenodd"
                />
              </svg>
              {t("auth.logout")}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
        isLight
          ? "bg-white text-blue-700 hover:bg-blue-50"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      {t("auth.login")}
    </Link>
  );
}

export function GoogleSignInButton({
  callbackUrl = "/",
}: {
  callbackUrl?: string;
}) {
  const t = useTranslations();

  return (
    <form action={signInWithGoogleAction.bind(null, callbackUrl)}>
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-800 shadow-sm transition-colors hover:bg-zinc-50"
      >
        <GoogleIcon />
        {t("auth.loginWithGoogle")}
      </button>
    </form>
  );
}

export function LineSignInButton({
  callbackUrl = "/",
}: {
  callbackUrl?: string;
}) {
  const t = useTranslations();

  return (
    <form action={signInWithLineAction.bind(null, callbackUrl)}>
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#06C755]/30 bg-[#06C755] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#05b34c]"
      >
        <LineIcon />
        {t("auth.loginWithLine")}
      </button>
    </form>
  );
}

function LineIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
