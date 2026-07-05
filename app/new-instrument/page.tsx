"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import InstrumentForm from "@/components/new-instrument/InstrumentForm";

const FORM_ID = "instrument-form";

export default function NewInstrumentPage() {
  const router = useRouter();
  const [justSaved, setJustSaved] = useState(false);

  function handleSubmitSuccess() {
    setJustSaved(true);
    // ไม่ redirect ออกจากหน้าทันที เพราะหลังบันทึกข้อมูลพื้นฐานสำเร็จ
    // ต้องให้ผู้ใช้อยู่ในหน้านี้ต่อเพื่อเพิ่มรูปภาพอุปกรณ์ (gallery เปิดใช้ได้ก็ตอนนี้)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-card-text">เพิ่มอุปกรณ์ใหม่</h1>
        <div className="flex gap-3">
          {/* ปุ่มยกเลิก / กลับ: ข้อความเปลี่ยนเป็น "เสร็จสิ้น" หลังบันทึกสำเร็จ เพื่อให้ความหมายตรงกับสถานะ */}
          <button
            type="button"
            onClick={() => router.push("/")}
            className="px-6 py-2.5 text-sm font-semibold text-card-text bg-card border border-border rounded-xl shadow-sm transition-all duration-200 hover:bg-surface-muted active:scale-[0.98]"
          >
            {justSaved ? "เสร็จสิ้น กลับหน้าหลัก" : "ยกเลิก"}
          </button>

          {/* ปุ่มบันทึก: ผูกกับ <form id="instrument-form"> ใน InstrumentForm.tsx ผ่าน attribute form
              หลังบันทึกสำเร็จแล้ว ปุ่มนี้ใช้ไม่ได้อีก (ฟอร์มข้อมูลพื้นฐานถูกล็อกแล้ว ดูที่ InstrumentForm.tsx) */}
          {!justSaved && (
            <button
              type="submit"
              form={FORM_ID}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-mahidol-blue rounded-xl shadow-sm transition-all duration-200 hover:bg-mahidol-blue/90 hover:shadow-md active:scale-[0.98]"
            >
              บันทึกข้อมูล
            </button>
          )}
        </div>
      </div>
      <InstrumentForm formId={FORM_ID} onSubmitSuccess={handleSubmitSuccess} />
    </div>
  );
}
