import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AppShell from "@/components/AppShell";
import Providers from "@/components/Providers";
import { getLocale, getTranslator } from "@/lib/i18n/server";
import { getActiveRentalCountForSession } from "@/lib/rentals.server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const activeRentalCount = await getActiveRentalCountForSession();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full overflow-x-hidden antialiased`}
    >
      <body className="flex min-h-screen max-w-full flex-col overflow-x-hidden bg-[#faf9f6] text-zinc-900">
        <Providers locale={locale}>
          <AppShell activeRentalCount={activeRentalCount}>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
