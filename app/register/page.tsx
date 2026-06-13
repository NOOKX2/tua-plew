import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { GoogleSignInButton } from "@/components/AuthButton";
import { AuthDivider, RegisterForm } from "@/components/AuthForms";
import AuthLayout from "@/components/AuthLayout";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <AuthLayout variant="register">
      <RegisterForm />
      <AuthDivider />
      <GoogleSignInButton />
    </AuthLayout>
  );
}
