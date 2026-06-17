"use client";

import { useActionState } from "react";
import {
  commaFromArray,
  deleteEventAdminAction,
  linesFromArray,
  saveEventAdminAction,
} from "@/lib/actions/admin";
import type { CommunityEvent } from "@/lib/types";
import {
  AdminCheckbox,
  AdminField,
  AdminSelect,
  AdminTextarea,
} from "./AdminFormFields";
import DeleteEntityButton from "./DeleteEntityButton";

const emptyEvent: CommunityEvent = {
  id: "",
  title: "",
  shortDescription: "",
  description: "",
  activityType: "run-club",
  date: "",
  startTime: "",
  venue: "",
  address: "",
  locationId: "",
  organizer: "",
  participantCount: 0,
  difficulty: "beginner",
  tags: [],
  recommendedProductIds: [],
  image: "",
};

const activityOptions = [
  { value: "run-club", label: "Run club" },
  { value: "hyrox", label: "Hyrox" },
  { value: "yoga", label: "โยคะ" },
  { value: "crossfit", label: "CrossFit" },
  { value: "cycling", label: "ปั่นจักรยาน" },
  { value: "swim", label: "ว่ายน้ำ" },
  { value: "pilates", label: "พิลาทิส" },
  { value: "hiking", label: "เดินป่า" },
];

export default function EventAdminForm({
  event,
  isNew,
}: {
  event?: CommunityEvent | null;
  isNew: boolean;
}) {
  const data = event ?? emptyEvent;
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      const result = await saveEventAdminAction(formData);
      if (!result.ok) return { error: result.error };
      return null;
    },
    null,
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="isNew" value={String(isNew)} />

      {state?.error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminField
          label="รหัสกิจกรรม (slug)"
          name="id"
          defaultValue={data.id}
          required
          readOnly={!isNew}
        />
        <AdminField label="ชื่อกิจกรรม" name="title" defaultValue={data.title} required />
        <AdminSelect
          label="ประเภทกิจกรรม"
          name="activityType"
          defaultValue={data.activityType}
          options={activityOptions}
        />
        <AdminSelect
          label="ระดับความยาก"
          name="difficulty"
          defaultValue={data.difficulty}
          options={[
            { value: "beginner", label: "เริ่มต้น" },
            { value: "intermediate", label: "ปานกลาง" },
            { value: "advanced", label: "ขั้นสูง" },
          ]}
        />
        <AdminField label="วันที่" name="date" type="date" defaultValue={data.date} required />
        <AdminField
          label="เวลาเริ่ม"
          name="startTime"
          type="time"
          defaultValue={data.startTime}
          required
        />
        <AdminField
          label="เวลาสิ้นสุด"
          name="endTime"
          type="time"
          defaultValue={data.endTime ?? ""}
        />
        <AdminField label="สถานที่" name="venue" defaultValue={data.venue} required />
        <AdminField label="ที่อยู่" name="address" defaultValue={data.address} required />
        <AdminField
          label="รหัสจุดเช่า (locationId)"
          name="locationId"
          defaultValue={data.locationId}
          required
        />
        <AdminField label="ผู้จัด" name="organizer" defaultValue={data.organizer} required />
        <AdminField
          label="จำนวนผู้เข้าร่วม"
          name="participantCount"
          type="number"
          min="0"
          defaultValue={data.participantCount}
          required
        />
        <AdminField
          label="จำนวนสูงสุด (ว่างได้)"
          name="maxParticipants"
          type="number"
          min="0"
          defaultValue={data.maxParticipants ?? ""}
        />
        <AdminField
          label="รูปภาพ (path)"
          name="image"
          defaultValue={data.image}
          required
        />
        <AdminField
          label="สินค้าแนะนำ (comma)"
          name="recommendedProductIds"
          defaultValue={commaFromArray(data.recommendedProductIds)}
        />
      </div>

      <AdminCheckbox label="แสดงเป็นที่เด่น (featured)" name="featured" defaultChecked={data.featured} />

      <AdminTextarea
        label="คำอธิบายสั้น"
        name="shortDescription"
        defaultValue={data.shortDescription}
        required
        rows={2}
      />
      <AdminTextarea
        label="รายละเอียด"
        name="description"
        defaultValue={data.description}
        required
      />
      <AdminTextarea
        label="แท็ก (หนึ่งบรรทัดต่อหนึ่งรายการ)"
        name="tags"
        defaultValue={linesFromArray(data.tags)}
      />

      <div className="flex flex-wrap items-center gap-3 border-t border-zinc-200 pt-6">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
        >
          {pending ? "กำลังบันทึก..." : isNew ? "สร้างกิจกรรม" : "บันทึกการแก้ไข"}
        </button>
        {!isNew && event ? (
          <DeleteEntityButton
            label="ลบกิจกรรม"
            confirmMessage={`ลบกิจกรรม "${event.title}" ถาวร?`}
            action={() => deleteEventAdminAction(event.id)}
          />
        ) : null}
      </div>
    </form>
  );
}
