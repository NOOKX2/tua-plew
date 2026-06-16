"use server";

import { connectDB } from "@/lib/mongoose";
import { User } from "@/lib/models";
import { hashPassword, isPasswordStrongEnough } from "@/lib/password";
import { getTranslator } from "@/lib/i18n/server";
import type { ActionResult } from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function registerUserAction(input: {
  name: string;
  email: string;
  password: string;
}): Promise<ActionResult> {
  const t = await getTranslator();
  const trimmedName = input.name.trim();
  const normalizedEmail = input.email.trim().toLowerCase();
  const rawPassword = input.password;

  if (!trimmedName) {
    return { ok: false, error: t("auth.errors.nameRequired") };
  }

  if (!EMAIL_RE.test(normalizedEmail)) {
    return { ok: false, error: t("auth.errors.invalidEmail") };
  }

  if (!isPasswordStrongEnough(rawPassword)) {
    return { ok: false, error: t("auth.errors.passwordTooShort") };
  }

  await connectDB();

  const existing = await User.findOne({ email: normalizedEmail });

  if (existing) {
    return { ok: false, error: t("auth.errors.emailTaken") };
  }

  const passwordHash = await hashPassword(rawPassword);

  await User.create({
    name: trimmedName,
    email: normalizedEmail,
    passwordHash,
  });

  return { ok: true, data: undefined };
}
