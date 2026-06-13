import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { User } from "@/lib/models";
import { hashPassword, isPasswordStrongEnough } from "@/lib/password";
import { getTranslatorFromRequest } from "@/lib/i18n/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const t = getTranslatorFromRequest(request);
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: t("auth.errors.invalidData") },
      { status: 400 },
    );
  }

  const { name, email, password } = body as {
    name?: string;
    email?: string;
    password?: string;
  };

  const trimmedName = name?.trim() ?? "";
  const normalizedEmail = email?.trim().toLowerCase() ?? "";
  const rawPassword = password ?? "";

  if (!trimmedName) {
    return NextResponse.json(
      { error: t("auth.errors.nameRequired") },
      { status: 400 },
    );
  }

  if (!EMAIL_RE.test(normalizedEmail)) {
    return NextResponse.json(
      { error: t("auth.errors.invalidEmail") },
      { status: 400 },
    );
  }

  if (!isPasswordStrongEnough(rawPassword)) {
    return NextResponse.json(
      { error: t("auth.errors.passwordTooShort") },
      { status: 400 },
    );
  }

  await connectDB();

  const existing = await User.findOne({ email: normalizedEmail });

  if (existing) {
    return NextResponse.json(
      { error: t("auth.errors.emailTaken") },
      { status: 409 },
    );
  }

  const passwordHash = await hashPassword(rawPassword);

  await User.create({
    name: trimmedName,
    email: normalizedEmail,
    passwordHash,
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
