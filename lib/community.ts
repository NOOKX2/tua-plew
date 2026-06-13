import type { CommunityActivityType, CommunityEvent } from "./types";

export const ACTIVITY_LABELS: Record<CommunityActivityType, string> = {
  "run-club": "รันนิ่งคลับ",
  hyrox: "Hyrox",
  yoga: "โยคะ",
  crossfit: "CrossFit",
  cycling: "ปั่นจักรยาน",
  swim: "ว่ายน้ำ",
  pilates: "พิลาทิส",
  hiking: "เดินป่า",
};

export const ACTIVITY_EMOJI: Record<CommunityActivityType, string> = {
  "run-club": "🏃",
  hyrox: "💪",
  yoga: "🧘",
  crossfit: "🏋️",
  cycling: "🚴",
  swim: "🏊",
  pilates: "🤸",
  hiking: "⛰️",
};

export const ACTIVITY_GRADIENT: Record<CommunityActivityType, string> = {
  "run-club": "from-orange-500 to-rose-500",
  hyrox: "from-zinc-800 to-amber-600",
  yoga: "from-violet-500 to-purple-400",
  crossfit: "from-red-600 to-orange-500",
  cycling: "from-sky-500 to-blue-600",
  swim: "from-cyan-500 to-teal-500",
  pilates: "from-pink-500 to-rose-400",
  hiking: "from-emerald-600 to-lime-500",
};

export const DIFFICULTY_LABELS: Record<
  CommunityEvent["difficulty"],
  string
> = {
  beginner: "เริ่มต้น",
  intermediate: "ปานกลาง",
  advanced: "ขั้นสูง",
};

export function getCommunityEventById(
  id: string,
  events: CommunityEvent[],
): CommunityEvent | undefined {
  return events.find((event) => event.id === id);
}

export function getFeaturedEvents(events: CommunityEvent[]): CommunityEvent[] {
  return events.filter((event) => event.featured);
}

export function getUpcomingEvents(
  events: CommunityEvent[],
): CommunityEvent[] {
  return [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}

export function getEventsByType(
  type: CommunityActivityType,
  events: CommunityEvent[],
): CommunityEvent[] {
  return events.filter((event) => event.activityType === type);
}

export function formatEventDate(date: string): string {
  return new Date(date).toLocaleDateString("th-TH", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatEventTime(start: string, end?: string): string {
  if (end) return `${start} – ${end} น.`;
  return `${start} น.`;
}

export function spotsLeft(event: CommunityEvent): number | null {
  if (!event.maxParticipants) return null;
  return Math.max(0, event.maxParticipants - event.participantCount);
}

export function isEventJoinable(event: CommunityEvent, asOf = new Date()): boolean {
  const eventEnd = new Date(event.date);
  if (event.endTime) {
    const [hours, minutes] = event.endTime.split(":").map(Number);
    eventEnd.setHours(hours, minutes ?? 0, 0, 0);
  } else {
    eventEnd.setHours(23, 59, 59, 999);
  }
  return asOf <= eventEnd;
}

export function isEventFull(event: CommunityEvent): boolean {
  if (!event.maxParticipants) return false;
  return event.participantCount >= event.maxParticipants;
}
