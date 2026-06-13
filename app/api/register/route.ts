import { NextResponse } from "next/server";
import { hashPassword, isPasswordStrongEnough } from "@/lib/password";
import { prisma } from "@/lib/prisma";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "ข้อมูลไม่ถูกต้อง" },
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
      { error: "กรุณากรอกชื่อ" },
      { status: 400 },
    );
  }

  if (!EMAIL_RE.test(normalizedEmail)) {
    return NextResponse.json(
      { error: "รูปแบบอีเมลไม่ถูกต้อง" },
      { status: 400 },
    );
  }

  if (!isPasswordStrongEnough(rawPassword)) {
    return NextResponse.json(
      { error: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" },
      { status: 400 },
    );
  }

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    return NextResponse.json(
      { error: "อีเมลนี้ถูกใช้งานแล้ว" },
      { status: 409 },
    );
  }

  const passwordHash = await hashPassword(rawPassword);

  await prisma.user.create({
    data: {
      name: trimmedName,
      email: normalizedEmail,
      passwordHash,
    },
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
