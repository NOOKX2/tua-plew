import type { Metadata } from "next";
import CampaignList from "@/components/CampaignList";
import { getCampaigns } from "@/lib/campaigns.server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "แคมเปญ | Tua Plew",
  description:
    "โปรโมชันและสิทธิพิเศษจาก Tua Plew และร้านพาร์ทเนอร์ร่วมรายการ เช่น เช่า 10 ครั้งรับส่วนลด 5%",
};

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-8">
        <p className="mb-1 text-sm font-medium text-amber-600">
          Tua Plew Campaigns
        </p>
        <h1 className="mb-2 text-2xl font-bold text-zinc-900 sm:text-3xl">
          แคมเปญและโปรโมชัน
        </h1>
        <p className="max-w-2xl text-sm text-zinc-500 sm:text-base">
          สิทธิพิเศษสำหรับสมาชิก Tua Plew — สะสมการเช่า รับส่วนลด
          และโปรโมชันจากร้านพาร์ทเนอร์ร่วมรายการ
        </p>
      </div>

      <CampaignList campaigns={campaigns} />
    </main>
  );
}
