"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";

export async function signInWithCredentialsAction(input: {
  email: string;
  password: string;
  callbackUrl?: string;
}) {
  try {
    await signIn("credentials", {
      email: input.email.trim().toLowerCase(),
      password: input.password,
      redirectTo: input.callbackUrl ?? "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false as const, error: "invalid_credentials" };
    }
    throw error;
  }

  return { ok: true as const };
}

export async function signInWithGoogleAction(callbackUrl = "/") {
  await signIn("google", { redirectTo: callbackUrl });
}

export async function signInWithLineAction(callbackUrl = "/") {
  await signIn("line", { redirectTo: callbackUrl });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
