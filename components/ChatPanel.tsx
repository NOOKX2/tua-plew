"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/types";
import { useTranslations } from "@/lib/i18n/client";

type Props = {
  messages: ChatMessage[];
  currentUserId: string;
  onSend: (body: string) => Promise<{ ok: boolean; error?: string }>;
  onRefresh: () => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
};

export default function ChatPanel({
  messages,
  currentUserId,
  onSend,
  onRefresh,
  disabled = false,
  placeholder,
}: Props) {
  const t = useTranslations();
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      void onRefresh();
    }, 4000);
    return () => window.clearInterval(timer);
  }, [onRefresh]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const body = draft.trim();
    if (!body || sending || disabled) return;

    setSending(true);
    setError(null);
    const result = await onSend(body);
    setSending(false);

    if (!result.ok) {
      setError(result.error ?? t("community.social.errors.sendFailed"));
      return;
    }

    setDraft("");
    await onRefresh();
  }

  return (
    <div className="flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div
        ref={listRef}
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4"
      >
        {messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-500">
            {t("community.social.chat.empty")}
          </p>
        ) : (
          messages.map((message) => {
            const mine = message.senderId === currentUserId;
            return (
              <div
                key={message.id}
                className={`flex gap-2 ${mine ? "flex-row-reverse" : ""}`}
              >
                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-zinc-100">
                  {message.senderImage ? (
                    <Image
                      src={message.senderImage}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-bold text-zinc-500">
                      {message.senderName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div
                  className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm ${
                    mine
                      ? "rounded-tr-md bg-emerald-600 text-white"
                      : "rounded-tl-md bg-zinc-100 text-zinc-800"
                  }`}
                >
                  {!mine && (
                    <p className="mb-1 text-[11px] font-semibold opacity-80">
                      {message.senderName}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap break-words">{message.body}</p>
                  <p
                    className={`mt-1 text-[10px] ${
                      mine ? "text-emerald-100" : "text-zinc-400"
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-zinc-100 bg-zinc-50 p-3"
      >
        {error && (
          <p className="mb-2 text-xs font-medium text-red-600">{error}</p>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={placeholder ?? t("community.social.chat.placeholder")}
            disabled={disabled || sending}
            maxLength={2000}
            className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-emerald-400"
          />
          <button
            type="submit"
            disabled={disabled || sending || !draft.trim()}
            className="shrink-0 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending
              ? t("community.social.chat.sending")
              : t("community.social.chat.send")}
          </button>
        </div>
      </form>
    </div>
  );
}
