import type { Metadata } from "next";
import CommunityList from "@/components/CommunityList";
import { getCommunityEvents } from "@/lib/community.server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ชุมชนกิจกรรม | Fit-to-Go",
  description:
    "รันนิ่งคลับ Hyrox โยคะ CrossFit และกิจกรรมออกกำลังกายใกล้จุดเช่าชุดกีฬา Fit-to-Go",
};

export default async function CommunityPage() {
  const events = await getCommunityEvents();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-8">
        <p className="mb-1 text-sm font-medium text-emerald-600">
          Fit-to-Go Community
        </p>
        <h1 className="mb-2 text-2xl font-bold text-zinc-900 sm:text-3xl">
          ชุมชนกิจกรรมออกกำลังกาย
        </h1>
        <p className="max-w-2xl text-sm text-zinc-500 sm:text-base">
          ค้นหากิจกรรมที่ใช่สำหรับคุณ — จากรันนิ่งคลับและ Hyrox ไปจนถึงโยคะและเดินป่า
          ทุกกิจกรรมอยู่ใกล้จุดเช่าชุดกีฬาสะอาดของเรา
        </p>
      </div>

      <CommunityList events={events} />
    </main>
  );
}
