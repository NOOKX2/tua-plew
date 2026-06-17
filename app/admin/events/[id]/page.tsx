import { notFound } from "next/navigation";
import EventAdminForm from "@/components/admin/EventAdminForm";
import { getAdminEvent } from "@/lib/admin/catalog.server";

export default async function AdminEventEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";

  if (isNew) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold text-zinc-900">เพิ่มกิจกรรมใหม่</h1>
        <EventAdminForm isNew />
      </div>
    );
  }

  const event = await getAdminEvent(id);
  if (!event) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">แก้ไขกิจกรรม</h1>
      <EventAdminForm event={event} isNew={false} />
    </div>
  );
}
