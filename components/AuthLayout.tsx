import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  variant: "login" | "register";
  children: ReactNode;
};

const COPY = {
  login: {
    title: "ยินดีต้อนรับกลับ!",
    subtitle: "กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ",
    altPrompt: "ยังไม่มีบัญชี?",
    altLink: "สมัครฟรี",
    altHref: "/register",
  },
  register: {
    title: "สร้างบัญชีใหม่",
    subtitle: "กรอกข้อมูลเพื่อเริ่มเช่าชุดกีฬาได้ทันที",
    altPrompt: "มีบัญชีอยู่แล้ว?",
    altLink: "เข้าสู่ระบบ",
    altHref: "/login",
  },
} as const;

export default function AuthLayout({ variant, children }: Props) {
  const copy = COPY[variant];

  return (
    <div className="flex min-h-screen bg-white">
      <aside className="relative hidden overflow-hidden lg:flex lg:w-1/2 xl:w-[55%]">
        <Image
          src="/community/lumpini-run-club.jpg"
          alt="นักวิ่งในสวนลุมพินี"
          fill
          priority
          sizes="55vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/85 via-emerald-900/70 to-zinc-950/80" />

        <div className="relative z-10 flex h-full w-full flex-col justify-between p-10 xl:p-14">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-lg font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/15"
          >
            Tua Plew
          </Link>

          <div className="max-w-lg">
            <span className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-emerald-100 backdrop-blur-sm">
              เช่า · ออกกำลัง · ไปต่อ
            </span>
            <h2 className="mb-4 text-4xl font-bold leading-tight text-white xl:text-5xl">
              ออกกำลังได้ทันที
              <br />
              <span className="text-emerald-300">ไม่ต้องรอซัก</span>
            </h2>
            <p className="text-sm leading-relaxed text-white/80 sm:text-base">
              เช่าชุดกีฬาสะอาดจากจุดเช่าใกล้คุณ — วิ่ง โยคะ หรือออกกำลังกาย
              แล้วคืนชุดได้สะดวก มาตรฐานซักฆ่า Ozone ทุกครั้ง
            </p>
          </div>
        </div>
      </aside>

      <main className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 xl:px-20">
        <div className="mx-auto w-full max-w-md">
          <Link
            href="/"
            className="mb-8 inline-block text-lg font-bold text-emerald-600 lg:hidden"
          >
            Tua Plew
          </Link>

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
              className="font-semibold text-emerald-600 hover:underline"
            >
              {copy.altLink}
            </Link>
          </p>

          <p className="mt-4 text-center text-xs text-zinc-400">
            <Link href="/" className="hover:text-emerald-600 hover:underline">
              ข้ามไปดูสินค้าและจุดเช่า →
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
