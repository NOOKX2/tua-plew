import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { GoogleSignInButton } from "@/components/AuthButton";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-start px-4 pt-8 pb-12 sm:pt-12">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="mb-1 text-xl font-bold text-zinc-900">
            เข้าสู่ระบบ
          </h1>
          <p className="mb-6 text-sm text-zinc-500">
            ใช้บัญชี Google เพื่อเช่าชุดกีฬา ดูประวัติ และรับสิทธิพิเศษในอนาคต
          </p>

          <GoogleSignInButton />

          <p className="mt-6 text-center text-xs text-zinc-400">
            ยังไม่มีบัญชี? การเข้าสู่ระบบด้วย Google จะสร้างบัญชีให้อัตโนมัติ
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-500">
          <Link href="/" className="text-emerald-600 hover:underline">
            ข้ามไปดูสินค้าและจุดเช่า →
          </Link>
        </p>
      </main>
    </div>
  );
}
