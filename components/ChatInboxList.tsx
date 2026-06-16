"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { ChatInboxItem, ChatInboxKind } from "@/lib/types";
import { useTranslations } from "@/lib/i18n/client";
import { UserAvatar } from "./CommunitySocialNav";

type Props = {
  items: ChatInboxItem[];
};

type Filter = "all" | ChatInboxKind;

function formatInboxTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime()) || date.getTime() === 0) return "";

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function ChatInboxList({ items }: Props) {
  const t = useTranslations();
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((item) => item.kind === filter);
  }, [filter, items]);

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: t("chat.inbox.filterAll") },
    { id: "direct", label: t("chat.inbox.filterDirect") },
    { id: "event", label: t("chat.inbox.filterGroups") },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex gap-2 overflow-x-auto border-b border-zinc-100 px-4 py-3">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              filter === item.id
                ? "bg-emerald-600 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="px-6 py-14 text-center">
          <p className="text-sm text-zinc-500">{t("chat.inbox.empty")}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link
              href="/community"
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              {t("chat.inbox.browseEvents")}
            </Link>
            <Link
              href="/community/friends"
              className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700"
            >
              {t("chat.inbox.findFriends")}
            </Link>
          </div>
        </div>
      ) : (
        <ul className="divide-y divide-zinc-100">
          {filtered.map((item) => (
            <li key={`${item.kind}-${item.id}`}>
              <Link
                href={item.href}
                className="flex items-center gap-3 px-4 py-4 transition-colors hover:bg-zinc-50 sm:px-5"
              >
                {item.kind === "event" ? (
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-zinc-100 ring-2 ring-white">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-lg">
                        👥
                      </div>
                    )}
                  </div>
                ) : (
                  <UserAvatar name={item.title} image={item.image} />
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <p className="truncate font-semibold text-zinc-900">
                        {item.title}
                      </p>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                          item.kind === "event"
                            ? "bg-violet-100 text-violet-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {item.kind === "event"
                          ? t("chat.inbox.groupBadge")
                          : t("chat.inbox.directBadge")}
                      </span>
                    </div>
                    <span className="shrink-0 text-[11px] text-zinc-400">
                      {formatInboxTime(item.lastMessageAt)}
                    </span>
                  </div>
                  <p className="truncate text-sm text-zinc-500">
                    {item.lastMessage || t("chat.inbox.noMessagesYet")}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
