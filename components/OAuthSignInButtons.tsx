"use client";

import { GoogleSignInButton, LineSignInButton } from "@/components/AuthButton";

type Props = {
  callbackUrl?: string;
  showGoogle?: boolean;
  showLine?: boolean;
};

export default function OAuthSignInButtons({
  callbackUrl = "/",
  showGoogle = true,
  showLine = true,
}: Props) {
  if (!showGoogle && !showLine) return null;

  return (
    <div className="space-y-3">
      {showLine ? <LineSignInButton callbackUrl={callbackUrl} /> : null}
      {showGoogle ? <GoogleSignInButton callbackUrl={callbackUrl} /> : null}
    </div>
  );
}
