import { notFound } from "next/navigation";
import CampaignAdminForm from "@/components/admin/CampaignAdminForm";
import { getAdminCampaign } from "@/lib/admin/catalog.server";

export default async function AdminCampaignEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";

  if (isNew) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold text-zinc-900">เพิ่มแคมเปญใหม่</h1>
        <CampaignAdminForm isNew />
      </div>
    );
  }

  const campaign = await getAdminCampaign(id);
  if (!campaign) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">แก้ไขแคมเปญ</h1>
      <CampaignAdminForm campaign={campaign} isNew={false} />
    </div>
  );
}
