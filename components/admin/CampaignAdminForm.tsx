"use client";

import { useActionState } from "react";
import {
  commaFromArray,
  deleteCampaignAdminAction,
  linesFromArray,
  saveCampaignAdminAction,
} from "@/lib/actions/admin";
import type { Campaign } from "@/lib/types";
import {
  AdminCheckbox,
  AdminField,
  AdminSelect,
  AdminTextarea,
} from "./AdminFormFields";
import DeleteEntityButton from "./DeleteEntityButton";

const emptyCampaign: Campaign = {
  id: "",
  title: "",
  shortDescription: "",
  description: "",
  campaignType: "loyalty",
  image: "",
  discountPercent: 0,
  partnerLocationIds: [],
  startDate: "",
  endDate: "",
  terms: [],
};

export default function CampaignAdminForm({
  campaign,
  isNew,
}: {
  campaign?: Campaign | null;
  isNew: boolean;
}) {
  const data = campaign ?? emptyCampaign;
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      const result = await saveCampaignAdminAction(formData);
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
          label="รหัสแคมเปญ (slug)"
          name="id"
          defaultValue={data.id}
          required
          readOnly={!isNew}
        />
        <AdminField label="ชื่อแคมเปญ" name="title" defaultValue={data.title} required />
        <AdminSelect
          label="ประเภท"
          name="campaignType"
          defaultValue={data.campaignType}
          options={[
            { value: "loyalty", label: "สะสมแต้ม / Loyalty" },
            { value: "first-time", label: "ครั้งแรก" },
            { value: "bundle", label: "แพ็กเกจ" },
            { value: "seasonal", label: "ตามฤดูกาล" },
          ]}
        />
        <AdminField
          label="ส่วนลด (%)"
          name="discountPercent"
          type="number"
          min="0"
          defaultValue={data.discountPercent}
          required
        />
        <AdminField
          label="จำนวนเช่าที่ต้องสะสม (ว่างได้)"
          name="requiredRentals"
          type="number"
          min="0"
          defaultValue={data.requiredRentals ?? ""}
        />
        <AdminField
          label="ป้ายรางวัล (ว่างได้)"
          name="rewardLabel"
          defaultValue={data.rewardLabel ?? ""}
        />
        <AdminField
          label="วันเริ่ม"
          name="startDate"
          type="date"
          defaultValue={data.startDate}
          required
        />
        <AdminField
          label="วันสิ้นสุด"
          name="endDate"
          type="date"
          defaultValue={data.endDate}
          required
        />
        <AdminField
          label="รูปภาพ (path)"
          name="image"
          defaultValue={data.image}
          required
        />
        <AdminField
          label="จุดเช่าที่ร่วมรายการ (comma)"
          name="partnerLocationIds"
          defaultValue={commaFromArray(data.partnerLocationIds)}
          hint="เช่น lumpini, siam, thonglor"
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
        label="เงื่อนไข (หนึ่งบรรทัดต่อหนึ่งรายการ)"
        name="terms"
        defaultValue={linesFromArray(data.terms)}
      />
      <AdminTextarea
        label="ขั้นตอนรับรางวัล (หนึ่งบรรทัดต่อหนึ่งรายการ)"
        name="howToClaimSteps"
        defaultValue={linesFromArray(data.howToClaimSteps)}
      />

      <div className="flex flex-wrap items-center gap-3 border-t border-zinc-200 pt-6">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
        >
          {pending ? "กำลังบันทึก..." : isNew ? "สร้างแคมเปญ" : "บันทึกการแก้ไข"}
        </button>
        {!isNew && campaign ? (
          <DeleteEntityButton
            label="ลบแคมเปญ"
            confirmMessage={`ลบแคมเปญ "${campaign.title}" ถาวร?`}
            action={() => deleteCampaignAdminAction(campaign.id)}
          />
        ) : null}
      </div>
    </form>
  );
}
