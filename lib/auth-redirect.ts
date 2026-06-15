export function safeCallbackPath(
  callbackUrl: string | undefined,
  fallback = "/",
): string {
  if (!callbackUrl || !callbackUrl.startsWith("/") || callbackUrl.startsWith("//")) {
    return fallback;
  }
  return callbackUrl;
}
