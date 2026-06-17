"use client";

import { useActionState } from "react";
import {
  commaFromArray,
  deleteProductAdminAction,
  jsonFromArray,
  linesFromArray,
  saveProductAdminAction,
} from "@/lib/actions/admin";
import type { Product } from "@/lib/types";
import {
  AdminCheckbox,
  AdminField,
  AdminSelect,
  AdminTextarea,
} from "./AdminFormFields";
import DeleteEntityButton from "./DeleteEntityButton";

const emptyProduct: Product = {
  id: "",
  name: "",
  description: "",
  longDescription: "",
  category: "top",
  image: "",
  pricePerRental: 49,
  material: "",
  color: "",
  sizes: ["S", "M", "L"],
  sizeUnit: "ตัว",
  features: [],
  activities: [],
  sizeGuide: [],
  careNote: "",
};

export default function ProductAdminForm({
  product,
  isNew,
}: {
  product?: Product | null;
  isNew: boolean;
}) {
  const data = product ?? emptyProduct;
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      const result = await saveProductAdminAction(formData);
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
          label="รหัสสินค้า (slug)"
          name="id"
          defaultValue={data.id}
          required
          readOnly={!isNew}
          hint="เช่น dri-fit-tee — ใช้ a-z, 0-9, และ - เท่านั้น"
        />
        <AdminField label="ชื่อสินค้า" name="name" defaultValue={data.name} required />
        <AdminSelect
          label="หมวดหมู่"
          name="category"
          defaultValue={data.category}
          options={[
            { value: "top", label: "เสื้อ" },
            { value: "bottom", label: "กางเกง" },
            { value: "set", label: "ชุด" },
            { value: "shoe", label: "รองเท้า" },
          ]}
        />
        <AdminField
          label="ราคาเช่า (บาท)"
          name="pricePerRental"
          type="number"
          min="0"
          defaultValue={data.pricePerRental}
          required
        />
        <AdminField label="แบรนด์" name="brand" defaultValue={data.brand ?? ""} />
        <AdminField label="สี" name="color" defaultValue={data.color} required />
        <AdminField label="วัสดุ" name="material" defaultValue={data.material} required />
        <AdminSelect
          label="หน่วยขนาด"
          name="sizeUnit"
          defaultValue={data.sizeUnit}
          options={[
            { value: "ตัว", label: "ตัว" },
            { value: "คู่", label: "คู่" },
          ]}
        />
        <AdminField
          label="ขนาด (คั่นด้วย comma)"
          name="sizes"
          defaultValue={commaFromArray(data.sizes)}
          required
          hint="เช่น XS, S, M, L, XL"
        />
        <AdminField
          label="รูปภาพ (path)"
          name="image"
          defaultValue={data.image}
          required
          hint="เช่น /products/dri-fit-tee.jpg"
        />
      </div>

      <AdminCheckbox
        label="แบรนด์พาร์ทเนอร์"
        name="isPartnerBrand"
        defaultChecked={data.isPartnerBrand}
      />

      <AdminTextarea
        label="คำอธิบายสั้น"
        name="description"
        defaultValue={data.description}
        required
        rows={2}
      />
      <AdminTextarea
        label="คำอธิบายเต็ม"
        name="longDescription"
        defaultValue={data.longDescription}
        required
      />
      <AdminTextarea
        label="จุดเด่น (หนึ่งบรรทัดต่อหนึ่งรายการ)"
        name="features"
        defaultValue={linesFromArray(data.features)}
      />
      <AdminTextarea
        label="กิจกรรมที่เหมาะ (หนึ่งบรรทัดต่อหนึ่งรายการ)"
        name="activities"
        defaultValue={linesFromArray(data.activities)}
      />
      <AdminTextarea
        label="ตารางไซส์ (JSON)"
        name="sizeGuide"
        defaultValue={jsonFromArray(data.sizeGuide)}
        hint='เช่น [{"size":"M","chest":"86–91 ซม."}]'
        rows={6}
      />
      <AdminTextarea
        label="หมายเหตุการดูแล"
        name="careNote"
        defaultValue={data.careNote}
        required
      />

      <div className="flex flex-wrap items-center gap-3 border-t border-zinc-200 pt-6">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
        >
          {pending ? "กำลังบันทึก..." : isNew ? "สร้างสินค้า" : "บันทึกการแก้ไข"}
        </button>
        {!isNew && product ? (
          <DeleteEntityButton
            label="ลบสินค้า"
            confirmMessage={`ลบสินค้า "${product.name}" ถาวร?`}
            action={() => deleteProductAdminAction(product.id)}
          />
        ) : null}
      </div>
    </form>
  );
}
