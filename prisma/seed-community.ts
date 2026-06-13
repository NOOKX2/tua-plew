import type { CommunityActivityType, CommunityEvent } from "../lib/types";

export const communityEvents: CommunityEvent[] = [
  {
    id: "lumpini-run-club",
    title: "Lumpini Run Club",
    shortDescription: "วิ่งรอบสวนลุมพินีทุกเสาร์เช้า เปิดรับทุกระดับ",
    description:
      "รันนิ่งคลับที่ใหญ่ที่สุดในใจกลางกรุงเทพฯ วิ่งรอบสวนลุมพินี 5–10 กม. มี pacers แยกกลุ่มความเร็ว หลังวิ่งมี stretching และ networking กับเพื่อนนักวิ่ง มาเช่าชุดวิ่งที่จุด Fit-to-Go สวนลุมพินีได้เลยก่อนเริ่ม",
    activityType: "run-club",
    date: "2026-06-14",
    startTime: "06:00",
    endTime: "07:30",
    venue: "สวนลุมพินี (ประตูทางเข้าฝั่งราชดำริ)",
    address: "ถ. พระราม 4 แขวงลุมพินี เขตปทุมวัน กรุงเทพฯ",
    locationId: "lumpini",
    organizer: "Lumpini Runners BKK",
    participantCount: 84,
    maxParticipants: 120,
    difficulty: "beginner",
    tags: ["วิ่งเช้า", "ฟรี", "ทุกระดับ"],
    recommendedProductIds: ["dri-fit-tee", "running-shorts", "running-shoes"],
    image: "/community/lumpini-run-club.jpg",
    featured: true,
  },
  {
    id: "hyrox-bkk-training",
    title: "Hyrox Bangkok Training Day",
    shortDescription: "ซ้อม Hyrox แบบครบสถานี — วิ่ง + functional fitness",
    description:
      "กิจกรรมซ้อม Hyrox สำหรับผู้ที่อยากลองหรือเตรียมตัวแข่ง ครบทั้ง SkiErg, Sled Push/Pull, Burpee Broad Jump, Rowing และ Wall Balls มีโค้ชแนะนำเทคนิคและ pacing แนะนำเช่าชุดและรองเท้าฝึกที่จุดเช่าอโศกก่อนเข้าร่วม",
    activityType: "hyrox",
    date: "2026-06-21",
    startTime: "08:00",
    endTime: "11:00",
    venue: "Hyrox Training Hub Thonglor",
    address: "ซ. ทองหล่อ แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ",
    locationId: "thonglor",
    organizer: "Hyrox Bangkok Community",
    participantCount: 42,
    maxParticipants: 50,
    difficulty: "advanced",
    tags: ["Hyrox", "Functional", "แข่งขัน"],
    recommendedProductIds: ["dri-fit-tee", "training-shoes", "leggings"],
    image: "/community/hyrox-bkk-training.jpg",
    featured: true,
  },
  {
    id: "sunrise-yoga-lumpini",
    title: "Sunrise Yoga ที่สวนลุมพินี",
    shortDescription: "โยคะยามเช้าใต้ต้นไม้ใหญ่ ผ่อนคลายก่อนเริ่มวัน",
    description:
      "คลาสโยคะกลางแจ้งสไตล์ Hatha–Vinyasa เหมาะสำหรับผู้เริ่มต้นและผู้ที่ต้องการฟื้นฟูร่างกาย นำโดยครูโยคะที่มีประสบการณ์ นำชุดโยคะไปเองหรือเช่าชุดโยคะสะอาดจาก Fit-to-Go ใกล้สวนได้",
    activityType: "yoga",
    date: "2026-06-15",
    startTime: "06:30",
    endTime: "07:30",
    venue: "สวนลุมพินี (ลานหญ้าใกล้ทะเลสาบ)",
    address: "ถ. พระราม 4 แขวงลุมพินี เขตปทุมวัน กรุงเทพฯ",
    locationId: "lumpini",
    organizer: "Mindful Morning Yoga",
    participantCount: 28,
    maxParticipants: 40,
    difficulty: "beginner",
    tags: ["โยคะ", "เช้า", "กลางแจ้ง"],
    recommendedProductIds: ["yoga-set", "leggings"],
    image: "/community/sunrise-yoga-lumpini.jpg",
    featured: true,
  },
  {
    id: "chatuchak-cycling",
    title: "Chatuchak Cycling Crew",
    shortDescription: "ปั่นจักรยานรอบสวนจตุจักร ระยะ 20–30 กม.",
    description:
      "กลุ่มปั่นจักรยานทุกอาทิตย์ ออกจากสวนจตุจักร ปั่นผ่านเส้นทางสีเขียวและถนนรอบนอก มีจุดพักน้ำและซ่อมยางเล็กน้อย แนะนำเช่าเสื้อกีฬาระบายอากาศดีก่อนออกปั่น",
    activityType: "cycling",
    date: "2026-06-22",
    startTime: "05:30",
    endTime: "08:00",
    venue: "สวนจตุจักร (ประตู 3)",
    address: "ถ. พหลโยธิน แขวงจตุจักร เขตจตุจักร กรุงเทพฯ",
    locationId: "chatuchak",
    organizer: "BKK Cycling Crew",
    participantCount: 35,
    maxParticipants: 60,
    difficulty: "intermediate",
    tags: ["ปั่นจักรยาน", "เช้า", "กลุ่ม"],
    recommendedProductIds: ["dri-fit-tee", "running-shorts"],
    image: "/community/chatuchak-cycling.jpg",
  },
  {
    id: "asoke-crossfit-wod",
    title: "Asoke CrossFit Community WOD",
    shortDescription: "Workout of the Day แบบเปิด ทุกระดับมี scaling",
    description:
      "ชุมชน CrossFit ที่อโศก จัด WOD ร่วมกันทุกพุธเย็น มีโค้ชช่วย scale ท่าให้เหมาะกับแต่ละคน เหมาะสำหรับคนที่อยากลอง CrossFit หรือหาเพื่อนออกกำลังกาย เช่ารองเท้าฝึกและชุดออกกำลังกายใกล้ BTS อโศก",
    activityType: "crossfit",
    date: "2026-06-18",
    startTime: "18:30",
    endTime: "19:45",
    venue: "Fitness Corner อโศก",
    address: "ถ. สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ",
    locationId: "asoke",
    organizer: "Asoke CrossFit Friends",
    participantCount: 18,
    maxParticipants: 25,
    difficulty: "intermediate",
    tags: ["CrossFit", "WOD", "เย็น"],
    recommendedProductIds: ["dri-fit-tee", "training-shoes", "running-shorts"],
    image: "/community/asoke-crossfit-wod.jpg",
  },
  {
    id: "samyan-swim-squad",
    title: "Samyan Swim Squad",
    shortDescription: "ว่ายน้ำเช้าวันอาทิตย์ สระละ 50 ม. แบ่งกลุ่มความเร็ว",
    description:
      "กลุ่มว่ายน้ำสำหรับคนรักการว่าย แบ่ง lane ตามความเร็ว มี warm-up และ drill technique 30 นาทีแรก เหมาะกับผู้ที่ว่าย freestyle ได้อย่างน้อย 25 ม. ต่อเนื่อง",
    activityType: "swim",
    date: "2026-06-28",
    startTime: "07:00",
    endTime: "08:30",
    venue: "สระว่ายน้ำสามย่าน",
    address: "ถ. พญาไท แขวงวังใหม่ เขตปทุมวัน กรุงเทพฯ",
    locationId: "samyan",
    organizer: "Samyan Aquatics",
    participantCount: 22,
    maxParticipants: 30,
    difficulty: "intermediate",
    tags: ["ว่ายน้ำ", "เทคนิค", "เช้า"],
    recommendedProductIds: ["dri-fit-tee"],
    image: "/community/samyan-swim-squad.jpg",
  },
  {
    id: "siam-pilates",
    title: "Siam Pilates Community Class",
    shortDescription: "พิลาทิสกลุ่มเล็ก เน้น core และ posture",
    description:
      "คลาสพิลาทิสสำหรับผู้เริ่มต้นและระดับกลาง เน้นการควบคุมลมหายใจและกล้ามเนื้อแกนกลาง จำกัด 15 คนต่อคลาส เช่าชุดยืดหยุ่นสะอาดจากจุดเช่าใกล้สยามก่อนเข้าคลาส",
    activityType: "pilates",
    date: "2026-06-20",
    startTime: "10:00",
    endTime: "11:00",
    venue: "Studio ใกล้สยามสแควร์",
    address: "ถ. พระราม 1 แขวงปทุมวัน เขตปทุมวัน กรุงเทพฯ",
    locationId: "siam",
    organizer: "Core & Flow Pilates",
    participantCount: 12,
    maxParticipants: 15,
    difficulty: "beginner",
    tags: ["พิลาทิส", "core", "กลุ่มเล็ก"],
    recommendedProductIds: ["leggings", "yoga-set"],
    image: "/community/siam-pilates.jpg",
  },
  {
    id: "khao-khaew-hike",
    title: "Khao Khaew Sunrise Hike",
    shortDescription: "เดินป่ายามเช้า ชมวิวและป่าเขตร้อน",
    description:
      "ทริปเดินป่า 1 วัน ที่เขาใหญ่–เขาเขียวทะเล ระยะทางประมาณ 8 กม. มีไกด์ท้องถิ่นและจุดพักน้ำ แนะนำเช่าเสื้อและกางเกงออกกำลังกายที่จุดเช่าทองหล่อก่อนออกเดินทาง",
    activityType: "hiking",
    date: "2026-07-05",
    startTime: "05:00",
    endTime: "12:00",
    venue: "อุทยานแห่งชาติเขาใหญ่",
    address: "อ. ปากช่อง จ. นครราชสีมา",
    locationId: "thonglor",
    organizer: "Bangkok Trail Seekers",
    participantCount: 16,
    maxParticipants: 20,
    difficulty: "intermediate",
    tags: ["เดินป่า", "ธรรมชาติ", "ทริป"],
    recommendedProductIds: ["dri-fit-tee", "running-shorts", "running-shoes"],
    image: "/community/khao-khaew-hike.jpg",
  },
];

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

export function getCommunityEventById(id: string): CommunityEvent | undefined {
  return communityEvents.find((event) => event.id === id);
}

export function getFeaturedEvents(): CommunityEvent[] {
  return communityEvents.filter((event) => event.featured);
}

export function getUpcomingEvents(
  events: CommunityEvent[] = communityEvents,
): CommunityEvent[] {
  return [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}

export function getEventsByType(
  type: CommunityActivityType,
): CommunityEvent[] {
  return communityEvents.filter((event) => event.activityType === type);
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
