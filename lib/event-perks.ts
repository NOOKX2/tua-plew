import type { EventJoinPerk } from "./types";

const basePerks: EventJoinPerk[] = [
  {
    id: "rental-join-discount",
    category: "rental",
    partnerName: "Tua Plew",
    title: "ส่วนลดเช่าชุดกีฬา 10%",
    description:
      "เช่าชุดกีฬาสะอาดก่อนเข้าร่วมกิจกรรม ใช้โค้ดนี้ที่จุดเช่าใกล้คุณ",
    code: "JOIN10",
    validUntil: "2026-12-31",
    highlight: true,
  },
  {
    id: "food-khao-man",
    category: "food",
    partnerName: "ข้าวมันไก่เจ๊กอง",
    title: "ลด 15% มื้อหลังออกกำลัง",
    description: "มื้ออาหารหลังวิ่งหรือออกกำลังกาย ลดทันทีเมื่อแสดงโค้ด",
    code: "TUAMAN15",
    validUntil: "2026-09-30",
  },
  {
    id: "coffee-brew-lab",
    category: "coffee",
    partnerName: "Brew Lab Coffee",
    title: "กาแฟฟรี 1 แก้ว",
    description: "รับกาแฟเย็นหรือร้อน 1 แก้ว เมื่อสั่งอาหารครบ 150 บาท",
    code: "TUABREW1",
    validUntil: "2026-09-30",
  },
  {
    id: "game-rov-skin",
    category: "gaming",
    partnerName: "Garena ROV",
    title: "คูปองสกิน ROV",
    description: "รับโค้ดแลกสกินหรือไอเทมในเกม Arena of Valor",
    code: "TUAROV2026",
    validUntil: "2026-08-31",
  },
];

const eventPerkIds: Record<string, string[]> = {
  "lumpini-run-club": [
    "rental-join-discount",
    "coffee-brew-lab",
    "food-khao-man",
    "game-rov-skin",
  ],
  "hyrox-bkk-training": [
    "rental-join-discount",
    "food-khao-man",
    "coffee-brew-lab",
    "game-rov-skin",
  ],
  "sunrise-yoga-lumpini": [
    "rental-join-discount",
    "coffee-brew-lab",
    "food-khao-man",
  ],
  "chatuchak-cycling": [
    "rental-join-discount",
    "coffee-brew-lab",
    "food-khao-man",
    "game-rov-skin",
  ],
  "asoke-crossfit-wod": [
    "rental-join-discount",
    "food-khao-man",
    "coffee-brew-lab",
  ],
  "siam-pilates": ["rental-join-discount", "coffee-brew-lab", "food-khao-man"],
  "samyan-swim-squad": [
    "rental-join-discount",
    "food-khao-man",
    "coffee-brew-lab",
  ],
  "khao-khaew-hike": [
    "rental-join-discount",
    "coffee-brew-lab",
    "food-khao-man",
    "game-rov-skin",
  ],
};

const perkById = new Map(basePerks.map((perk) => [perk.id, perk]));

export function getEventJoinPerkIds(eventId: string): string[] {
  return eventPerkIds[eventId] ?? basePerks.map((perk) => perk.id);
}

export function getEventJoinPerks(eventId: string): EventJoinPerk[] {
  return getEventJoinPerkIds(eventId)
    .map((id) => perkById.get(id))
    .filter((perk): perk is EventJoinPerk => perk !== undefined);
}
