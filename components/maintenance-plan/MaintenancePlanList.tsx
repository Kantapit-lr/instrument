import Link from "next/link";
import { MaintenancePlanListProps } from "@/types/components";

export function MaintenancePlanList({ plans, loading, onDelete }: MaintenancePlanListProps) {
  if (loading) {
    return <p className="p-6 text-sm text-text-muted">กำลังโหลด...</p>;
  }

  if (plans.length === 0) {
    return <p className="p-6 text-sm text-text-muted">ยังไม่มีกำหนดการในระบบ</p>;
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-surface-muted text-surface-muted-text text-left">
          <th className="px-6 py-3 font-medium">โครงการ</th>
          <th className="px-6 py-3 font-medium">ปี</th>
          <th className="px-6 py-3 font-medium">ผู้ดำเนินการ</th>
          <th className="px-6 py-3 font-medium">การอนุมัติ</th>
          <th className="px-6 py-3 font-medium">การจัดจ้าง</th>
          <th className="px-6 py-3 font-medium">ดำเนินงาน</th>
          <th className="px-6 py-3 font-medium">อุปกรณ์</th>
          <th className="px-6 py-3 font-medium text-right">การจัดการ</th>
        </tr>
      </thead>
      <tbody>
        {plans.map((plan) => (
          <tr key={plan.maintenancePlanId} className="border-t border-border">
            <td className="px-6 py-3 font-medium">{plan.projectName}</td>
            <td className="px-6 py-3">{plan.year}</td>
            <td className="px-6 py-3">{plan.operator}</td>
            <td className="px-6 py-3">
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-mahidol-blue/10 text-action-text">
                {plan.approvalStatus}
              </span>
            </td>
            <td className="px-6 py-3 text-text-muted">{plan.hiringStatus}</td>
            <td className="px-6 py-3 text-text-muted">{plan.processStatus}</td>
            <td className="px-6 py-3">{plan.detailCount}</td>
            <td className="px-6 py-3 text-right space-x-3">
              <Link href={`/schedules/${plan.maintenancePlanId}/edit`} className="text-action-text hover:underline">
                แก้ไข
              </Link>
              <button onClick={() => onDelete(plan)} className="text-danger-text hover:underline">
                ลบ
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
