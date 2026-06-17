"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signInWithCredentialsAction } from "@/lib/actions/auth-session";
import { registerUserAction } from "@/lib/actions/register";
import { useTranslations } from "@/lib/i18n/client";

const inputClass =
  "w-full rounded-xl border-0 bg-zinc-100 px-4 py-3 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-blue-500/25";

function EmailIcon() {
  return (
    <svg className="h-4 w-4 text-zinc-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
        <path
          fillRule="evenodd"
          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
          clipRule="evenodd"
        />
      </svg>
    );
  }
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
        clipRule="evenodd"
      />
      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
    </svg>
  );
}

function PasswordInput({
  id,
  label,
  value,
  onChange,
  autoComplete,
  placeholder,
  minLength,
  showLabel,
  hideLabel,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  placeholder: string;
  minLength?: number;
  showLabel: string;
  hideLabel: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-zinc-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required
          minLength={minLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} pr-11`}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-zinc-400 transition-colors hover:text-zinc-600"
          aria-label={visible ? hideLabel : showLabel}
        >
          <EyeIcon open={visible} />
        </button>
      </div>
    </div>
  );
}

export function CredentialsSignInForm({
  callbackUrl = "/",
}: {
  callbackUrl?: string;
}) {
  const t = useTranslations();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signInWithCredentialsAction({
      email,
      password,
      callbackUrl,
    });

    setLoading(false);

    if (!result.ok) {
      setError(t("auth.errors.invalidCredentials"));
      return;
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-zinc-700">
          {t("auth.email")}
        </label>
        <div className="relative">
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${inputClass} pr-11`}
            placeholder="you@example.com"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <EmailIcon />
          </span>
        </div>
      </div>

      <PasswordInput
        id="login-password"
        label={t("auth.password")}
        value={password}
        onChange={setPassword}
        autoComplete="current-password"
        placeholder="••••••••"
        showLabel={t("auth.showPassword")}
        hideLabel={t("auth.hidePassword")}
      />

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 disabled:opacity-60"
      >
        {loading ? t("auth.signingIn") : t("auth.login")}
      </button>
    </form>
  );
}

export function RegisterForm({
  callbackUrl = "/",
}: {
  callbackUrl?: string;
}) {
  const router = useRouter();
  const t = useTranslations();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(t("auth.errors.passwordMismatch"));
      return;
    }

    setLoading(true);

    const result = await registerUserAction({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    if (!result.ok) {
      setLoading(false);
      setError(result.error);
      return;
    }

    const signInResult = await signInWithCredentialsAction({
      email,
      password,
      callbackUrl,
    });

    setLoading(false);

    if (!signInResult.ok) {
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="register-name" className="mb-2 block text-sm font-medium text-zinc-700">
          {t("auth.name")}
        </label>
        <input
          id="register-name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          placeholder={t("auth.namePlaceholder")}
        />
      </div>

      <div>
        <label htmlFor="register-email" className="mb-2 block text-sm font-medium text-zinc-700">
          {t("auth.email")}
        </label>
        <div className="relative">
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${inputClass} pr-11`}
            placeholder="you@example.com"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <EmailIcon />
          </span>
        </div>
      </div>

      <PasswordInput
        id="register-password"
        label={t("auth.password")}
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
        placeholder={t("auth.passwordMinPlaceholder")}
        minLength={8}
        showLabel={t("auth.showPassword")}
        hideLabel={t("auth.hidePassword")}
      />

      <PasswordInput
        id="register-confirm-password"
        label={t("auth.confirmPassword")}
        value={confirmPassword}
        onChange={setConfirmPassword}
        autoComplete="new-password"
        placeholder={t("auth.confirmPasswordPlaceholder")}
        minLength={8}
        showLabel={t("auth.showPassword")}
        hideLabel={t("auth.hidePassword")}
      />

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 disabled:opacity-60"
      >
        {loading ? t("auth.signingUp") : t("auth.register")}
      </button>
    </form>
  );
}

export function AuthDivider() {
  const t = useTranslations();

  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-zinc-200" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="bg-white px-3 text-zinc-400">{t("common.or")}</span>
      </div>
    </div>
  );
}
