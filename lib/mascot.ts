export type MascotPose =
  | "run"
  | "wave"
  | "rental"
  | "campaign"
  | "chat"
  | "community"
  | "checkout"
  | "friends";

export const MASCOT_IMAGES: Record<MascotPose, string> = {
  run: "/mascot/run.png",
  wave: "/mascot/wave.png",
  rental: "/mascot/rental.png",
  campaign: "/mascot/campaign.png",
  chat: "/mascot/chat.png",
  community: "/mascot/community.png",
  checkout: "/mascot/checkout.png",
  friends: "/mascot/friends.png",
};

export const MASCOT_ALT = "ตัวมาสคอท Tua Plew";
