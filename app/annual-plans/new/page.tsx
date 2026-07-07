"use client";

import { useRouter } from "next/navigation";
import { AnnualPlanForm } from "@/components/annual-plan/AnnualPlanForm";

const FORM_ID = "annual-plan-form";

export default function NewAnnualPlanPage() {
  const router = useRouter();

  function handleSubmitSuccess() {
    router.push("/annual-plans");
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-card-text">สร้างแผนรายปี</h1>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/annual-plans")}
            className="px-6 py-2.5 text-sm font-semibold text-card-text bg-card border border-border rounded-xl shadow-sm transition-all duration-200 hover:bg-surface-muted active:scale-[0.98]"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            form={FORM_ID}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-mahidol-blue rounded-xl shadow-sm transition-all duration-200 hover:bg-mahidol-blue/90 hover:shadow-md active:scale-[0.98]"
          >
            บันทึกแผน
          </button>
        </div>
      </div>
      <AnnualPlanForm formId={FORM_ID} onSubmitSuccess={handleSubmitSuccess} />
    </div>
  );
}
