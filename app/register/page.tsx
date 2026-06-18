import { redirect } from "next/navigation";
import { GoogleSignInButton } from "@/components/AuthButton";
import { AuthDivider, RegisterForm } from "@/components/AuthForms";
import AuthLayout from "@/components/AuthLayout";
import { auth } from "@/auth";
import { safeCallbackPath } from "@/lib/auth-redirect";

type Props = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function RegisterPage({ searchParams }: Props) {
  const { callbackUrl } = await searchParams;
  const session = await auth();
  const nextPath = safeCallbackPath(callbackUrl);

  if (session?.user?.id) {
    redirect(nextPath);
  }

  return (
    <AuthLayout variant="register">
      <RegisterForm callbackUrl={nextPath} />
      <AuthDivider />
      <GoogleSignInButton callbackUrl={nextPath} />
    </AuthLayout>
  );
}
