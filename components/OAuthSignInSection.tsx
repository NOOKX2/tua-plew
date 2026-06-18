import { getConfiguredOAuthProviders } from "@/lib/auth-oauth";
import OAuthSignInButtons from "./OAuthSignInButtons";

type Props = {
  callbackUrl?: string;
};

export default function OAuthSignInSection({ callbackUrl = "/" }: Props) {
  const providers = getConfiguredOAuthProviders();

  if (!providers.google && !providers.line) {
    return null;
  }

  return (
    <OAuthSignInButtons
      callbackUrl={callbackUrl}
      showGoogle={providers.google}
      showLine={providers.line}
    />
  );
}
