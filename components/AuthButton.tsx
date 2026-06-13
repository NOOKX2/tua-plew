"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useTranslations } from "@/lib/i18n/client";

type Props = {
  variant?: "light" | "dark";
};

export default function AuthButton({ variant = "dark" }: Props) {
  const { data: session, status } = useSession();
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isLight = variant === "light";

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

  if (status === "loading") {
    return (
      <span
        className={`text-xs ${isLight ? "text-emerald-100" : "text-zinc-400"}`}
      >
        {t("common.loading")}
      </span>
    );
  }

  if (session?.user) {
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
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name ?? t("common.user")}
              width={32}
              height={32}
              className={`rounded-full ${isLight ? "ring-2 ring-white/30" : "ring-2 ring-zinc-200"}`}
            />
          ) : (
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                isLight
                  ? "bg-white/20 text-white"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {(session.user.name ?? "U").charAt(0).toUpperCase()}
            </span>
          )}
          <div className="hidden text-left sm:block">
            <p
              className={`max-w-[120px] truncate text-xs font-medium ${
                isLight ? "text-white" : "text-zinc-800"
              }`}
            >
              {session.user.name}
            </p>
            <p
              className={`max-w-[120px] truncate text-[10px] ${
                isLight ? "text-emerald-100" : "text-zinc-500"
              }`}
            >
              {session.user.email}
            </p>
          </div>
          <svg
            className={`hidden h-3.5 w-3.5 sm:block ${
              isLight ? "text-emerald-100" : "text-zinc-400"
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
                {session.user.name}
              </p>
              <p className="truncate text-xs text-zinc-500">
                {session.user.email}
              </p>
            </div>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                signOut();
              }}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-50"
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
          ? "bg-white text-emerald-700 hover:bg-emerald-50"
          : "bg-emerald-600 text-white hover:bg-emerald-700"
      }`}
    >
      {t("auth.login")}
    </Link>
  );
}

export function GoogleSignInButton() {
  const t = useTranslations();

  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl: "/" })}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-800 shadow-sm transition-colors hover:bg-zinc-50"
    >
      <GoogleIcon />
      {t("auth.loginWithGoogle")}
    </button>
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
