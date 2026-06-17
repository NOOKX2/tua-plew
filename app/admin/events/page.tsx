import AdminEntityList from "@/components/admin/AdminEntityList";
import { listAdminEvents } from "@/lib/admin/catalog.server";

export default async function AdminEventsPage() {
  const events = await listAdminEvents();

  return (
    <AdminEntityList
      title="จัดการกิจกรรม"
      description="แก้ไขอีเวนต์ชุมชนทั้งหมด"
      newHref="/admin/events/new"
      newLabel="+ เพิ่มกิจกรรม"
      emptyLabel="ยังไม่มีกิจกรรม"
      items={events.map((event) => ({
        id: event.id,
        title: event.title,
        subtitle: event.venue,
        meta: `${event.date} · ${event.organizer}`,
      }))}
    />
  );
}
