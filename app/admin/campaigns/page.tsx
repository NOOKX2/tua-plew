import AdminEntityList from "@/components/admin/AdminEntityList";
import { listAdminCampaigns } from "@/lib/admin/catalog.server";

export default async function AdminCampaignsPage() {
  const campaigns = await listAdminCampaigns();

  return (
    <AdminEntityList
      title="จัดการแคมเปญ"
      description="แก้ไขโปรโมชันและแคมเปญทั้งหมด"
      newHref="/admin/campaigns/new"
      newLabel="+ เพิ่มแคมเปญ"
      emptyLabel="ยังไม่มีแคมเปญ"
      items={campaigns.map((campaign) => ({
        id: campaign.id,
        title: campaign.title,
        subtitle: campaign.shortDescription,
        meta: `${campaign.startDate} – ${campaign.endDate}`,
      }))}
    />
  );
}
