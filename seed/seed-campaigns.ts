import type { Campaign, CampaignType } from "../lib/types";

export const campaigns: Campaign[] = [
  {
    id: "rent-10-get-5",
    title: "เช่า 10 ครั้ง รับส่วนลด 5%",
    shortDescription:
      "เช่าชุดกีฬาครบ 10 ครั้งที่ร้านพาร์ทเนอร์ร่วมรายการ รับส่วนลด 5% สำหรับการเช่าครั้งถัดไป",
    description:
      "โปรแกรมสะสมแต้มสำหรับสมาชิก Tua Plew ที่เช่าชุดกีฬาที่จุดพาร์ทเนอร์ร่วมรายการ ทุกครั้งที่เช่าและคืนชุดสำเร็จจะนับเป็น 1 ครั้ง เมื่อครบ 10 ครั้งภายในช่วงแคมเปญ รับส่วนลด 5% อัตโนมัติสำหรับการเช่าครั้งถัดไปที่ร้านพาร์ทเนอร์เดิม",
    campaignType: "loyalty",
    image: "/campaigns/rent-10-get-5.jpg",
    discountPercent: 5,
    requiredRentals: 10,
    partnerLocationIds: ["samyan", "thonglor"],
    startDate: "2026-06-01",
    endDate: "2026-12-31",
    terms: [
      "นับเฉพาะการเช่าที่จุดพาร์ทเนอร์ร่วมรายการเท่านั้น",
      "ต้องคืนชุดภายในเวลาที่กำหนดจึงจะนับเป็นครั้งที่สมบูรณ์",
      "ส่วนลด 5% ใช้ได้ 1 ครั้งหลังครบ 10 ครั้ง ภายใน 30 วันหลังปลดล็อก",
      "ไม่สามารถใช้ร่วมกับโปรโมชันอื่นได้",
      "Tua Plew ขอสงวนสิทธิ์ในการเปลี่ยนแปลงเงื่อนไขโดยไม่ต้องแจ้งล่วงหน้า",
    ],
    featured: true,
  },
  {
    id: "rent-10-gaming-reward",
    title: "เช่า 10 ครั้ง รับโค้ดในเกม",
    shortDescription:
      "ใช้บริการเช่าชุดกีฬาครบ 10 ครั้ง รับโค้ดสิทธิพิเศษในเกม ROV หรือ Roblox",
    description:
      "สิทธิพิเศษสำหรับสมาชิก Tua Plew ที่ใช้บริการเช่าชุดกีฬา เมื่อเช่าและคืนชุดสำเร็จครบ 10 ครั้งภายในช่วงแคมเปญ จะได้รับโค้ดในเกม 1 ชุด เลือกรับได้ระหว่าง ROV (Realm of Valor) หรือ Roblox โค้ดจะส่งให้ทางแอปหรืออีเมลที่ลงทะเบียนไว้",
    campaignType: "loyalty",
    image: "/campaigns/rent-10-gaming-reward.jpg",
    discountPercent: 0,
    rewardLabel: "โค้ดในเกม",
    requiredRentals: 10,
    howToClaimSteps: [
      "เข้าร่วมแคมเปญและเช่าชุดกีฬาผ่าน Tua Plew",
      "คืนชุดภายในเวลาที่กำหนด — แต่ละครั้งนับเป็น 1 ครั้ง",
      "สะสมครบ 10 ครั้ง เลือกรับโค้ดในเกม ROV หรือ Roblox",
    ],
    partnerLocationIds: [
      "lumpini",
      "siam",
      "asoke",
      "samyan",
      "chatuchak",
      "thonglor",
      "benjakitti",
      "central-park",
      "sirikit",
      "rotfai",
      "silom",
      "rama9",
      "phromphong",
    ],
    startDate: "2026-06-01",
    endDate: "2026-12-31",
    terms: [
      "นับเฉพาะการเช่าชุดกีฬาที่คืนชุดสำเร็จภายในช่วงแคมเปญ",
      "เลือกรับโค้ดได้ 1 เกมต่อ 1 สิทธิ์ ระหว่าง ROV หรือ Roblox",
      "โค้ดในเกมส่งให้ทางแอปหรืออีเมลภายใน 7 วันทำการหลังครบเงื่อนไข",
      "โค้ดมีอายุการใช้งานตามที่เกมกำหนด ไม่สามารถแลกเป็นเงินสดได้",
      "ต้องแจ้งรับสิทธิ์ภายใน 30 วันหลังครบ 10 ครั้ง",
      "ไม่สามารถโอนสิทธิ์หรือโค้ดให้ผู้อื่นได้",
      "Tua Plew ขอสงวนสิทธิ์ในการเปลี่ยนแปลงเงื่อนไขโดยไม่ต้องแจ้งล่วงหน้า",
    ],
    featured: true,
  },
  {
    id: "first-partner-10",
    title: "ลูกค้าใหม่ ลด 10% ที่ร้านพาร์ทเนอร์",
    shortDescription:
      "เช่าครั้งแรกที่จุดพาร์ทเนอร์ร่วมรายการ รับส่วนลดทันที 10%",
    description:
      "สำหรับสมาชิกที่ยังไม่เคยเช่าชุดกีฬาที่จุดพาร์ทเนอร์ Tua Plew มาก่อน เมื่อเช่าครั้งแรกที่ Fitness First สามย่าน หรือ Virgin Active ทองหล่อ รับส่วนลด 10% ทันทีเมื่อชำระเงิน",
    campaignType: "first-time",
    image: "/campaigns/first-partner-10.jpg",
    discountPercent: 10,
    partnerLocationIds: ["samyan", "thonglor"],
    startDate: "2026-06-01",
    endDate: "2026-09-30",
    terms: [
      "ใช้ได้ 1 ครั้งต่อ 1 บัญชีสมาชิก",
      "เฉพาะการเช่าครั้งแรกที่จุดพาร์ทเนอร์ร่วมรายการ",
      "ส่วนลดคำนวณจากค่าเช่าชุดกีฬาเท่านั้น ไม่รวมค่าประกัน (ถ้ามี)",
      "ต้องเข้าสู่ระบบด้วยบัญชี Tua Plew ก่อนเช่า",
    ],
    featured: true,
  },
  {
    id: "weekend-yoga-bundle",
    title: "เสาร์–อาทิตย์ เช่าชุดโยคะ ลด 15%",
    shortDescription:
      "เช่าชุดโยคะครบเซ็ตหรือกางเกงยาว วันเสาร์–อาทิตย์ รับส่วนลด 15%",
    description:
      "โปรโมชันสุดสัปดาห์สำหรับคนรักโยคะและพิลาทิส เช่าชุดโยคะครบเซ็ตหรือกางเกงยาววิ่ง ทุกวันเสาร์และอาทิตย์ รับส่วนลด 15% ที่ทุกจุดเช่า Tua Plew",
    campaignType: "bundle",
    image: "/campaigns/weekend-yoga-bundle.jpg",
    discountPercent: 15,
    partnerLocationIds: [
      "lumpini",
      "siam",
      "asoke",
      "samyan",
      "chatuchak",
      "thonglor",
      "benjakitti",
      "rotfai",
      "silom",
      "rama9",
      "phromphong",
    ],
    startDate: "2026-06-01",
    endDate: "2026-08-31",
    terms: [
      "ใช้ได้เฉพาะวันเสาร์และวันอาทิตย์",
      "เฉพาะสินค้าหมวดชุดโยคะครบเซ็ตและกางเกงยาววิ่ง",
      "ใช้ได้ทุกจุดเช่า Tua Plew",
      "จำกัด 1 สิทธิ์ต่อวันต่อบัญชี",
    ],
  },
  {
    id: "summer-run-club",
    title: "Summer Run Club — ลด 8%",
    shortDescription:
      "เข้าร่วมกิจกรรมรันนิ่งคลับในชุมชน Tua Plew แล้วเช่าชุดวิ่ง ลด 8%",
    description:
      "แคมเปญพิเศษช่วงฤดูร้อน สมาชิกที่เข้าร่วมกิจกรรมรันนิ่งคลับในหน้าชุมชน Tua Plew แล้วเช่าชุดวิ่ง (เสื้อ กางเกง หรือรองเท้า) ภายใน 7 วันหลังกิจกรรม รับส่วนลด 8%",
    campaignType: "seasonal",
    image: "/campaigns/summer-run-club.jpg",
    discountPercent: 8,
    partnerLocationIds: ["lumpini", "chatuchak", "benjakitti", "rotfai"],
    startDate: "2026-06-01",
    endDate: "2026-08-31",
    terms: [
      "ต้องเข้าร่วมกิจกรรมรันนิ่งคลับผ่านหน้าชุมชน Tua Plew",
      "เช่าชุดวิ่งภายใน 7 วันหลังวันจัดกิจกรรม",
      "เฉพาะสินค้าหมวดเสื้อ กางเกง และรองเท้าวิ่ง",
      "ใช้ได้ 1 ครั้งต่อกิจกรรม",
    ],
  },
];

export const CAMPAIGN_TYPE_LABELS: Record<CampaignType, string> = {
  loyalty: "สะสมแต้ม",
  "first-time": "ลูกค้าใหม่",
  bundle: "แพ็กเกจ",
  seasonal: "ตามฤดูกาล",
};

export const CAMPAIGN_TYPE_EMOJI: Record<CampaignType, string> = {
  loyalty: "🎯",
  "first-time": "✨",
  bundle: "📦",
  seasonal: "☀️",
};

export function getCampaignById(id: string): Campaign | undefined {
  return campaigns.find((campaign) => campaign.id === id);
}

export function getActiveCampaigns(
  list: Campaign[] = campaigns,
  asOf = new Date(),
): Campaign[] {
  return list.filter((campaign) => {
    const start = new Date(campaign.startDate);
    const end = new Date(campaign.endDate);
    end.setHours(23, 59, 59, 999);
    return asOf >= start && asOf <= end;
  });
}

export function getFeaturedCampaigns(): Campaign[] {
  return getActiveCampaigns().filter((campaign) => campaign.featured);
}

export function formatCampaignPeriod(start: string, end: string): string {
  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const startStr = new Date(start).toLocaleDateString("th-TH", opts);
  const endStr = new Date(end).toLocaleDateString("th-TH", opts);
  return `${startStr} – ${endStr}`;
}

export function formatDiscount(percent: number): string {
  return `ลด ${percent}%`;
}
