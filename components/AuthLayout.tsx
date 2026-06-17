import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { getTranslator } from "@/lib/i18n/server";
import LanguageSwitcher from "./LanguageSwitcher";

type Props = {
  variant: "login" | "register";
  children: ReactNode;
};

export default async function AuthLayout({ variant, children }: Props) {
  const t = await getTranslator();

  const copy =
    variant === "login"
      ? {
          title: t("auth.loginTitle"),
          subtitle: t("auth.loginSubtitle"),
          altPrompt: t("auth.noAccount"),
          altLink: t("auth.signUpFree"),
          altHref: "/register",
        }
      : {
          title: t("auth.registerTitle"),
          subtitle: t("auth.registerSubtitle"),
          altPrompt: t("auth.hasAccount"),
          altLink: t("auth.login"),
          altHref: "/login",
        };

  return (
    <div className="flex min-h-screen bg-white">
      <aside className="relative hidden overflow-hidden lg:flex lg:w-1/2 xl:w-[55%]">
        <Image
          src="/community/lumpini-run-club.jpg"
          alt={t("auth.heroImageAlt")}
          fill
          priority
          sizes="55vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/85 via-blue-900/70 to-zinc-950/80" />

        <div className="relative z-10 flex h-full w-full flex-col justify-between p-10 xl:p-14">
          <Link
            href="/"
            className="inline-flex w-fit shrink-0 text-2xl font-bold tracking-tight text-white sm:text-3xl"
          >
            Tua <span className="text-blue-300">Plew</span>
          </Link>

          <div className="max-w-lg">
            <span className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-blue-100 backdrop-blur-sm">
              {t("auth.heroBadge")}
            </span>
            <h2 className="mb-4 text-4xl font-bold leading-tight text-white xl:text-5xl">
              {t("auth.heroTitle")}
              <br />
              <span className="text-blue-300">{t("auth.heroTitleAccent")}</span>
            </h2>
            <p className="text-sm leading-relaxed text-white/80 sm:text-base">
              {t("auth.heroDescription")}
            </p>
          </div>
        </div>
      </aside>

      <main className="flex flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 px-5 py-3.5 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="shrink-0 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl lg:hidden"
          >
            Tua <span className="text-blue-600">Plew</span>
          </Link>
          <div className="ml-auto flex shrink-0 items-center">
            <LanguageSwitcher />
          </div>
        </header>

        <div className="flex flex-1 flex-col justify-center px-6 pb-10 sm:px-10 lg:px-14 lg:pb-10 xl:px-20">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              {copy.title}
            </h1>
            <p className="mt-2 text-sm text-zinc-500">{copy.subtitle}</p>
          </div>

          {children}

          <p className="mt-8 text-center text-sm text-zinc-500">
            {copy.altPrompt}{" "}
            <Link
              href={copy.altHref}
              className="font-semibold text-blue-600 hover:underline"
            >
              {copy.altLink}
            </Link>
          </p>

          <p className="mt-4 text-center text-xs text-zinc-400">
            <Link href="/" className="hover:text-blue-600 hover:underline">
              {t("common.skipToCatalog")}
            </Link>
          </p>
        </div>
        </div>
      </main>
    </div>
  );
}
