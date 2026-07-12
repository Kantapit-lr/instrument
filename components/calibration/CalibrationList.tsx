import Link from "next/link";
import { CalibrationListProps } from "@/types/components";

const RESULT_BADGE_LABEL: Record<string, string> = {
  PASS: "ผ่าน",
  NOT_PASS: "ไม่ผ่าน",
};

export function CalibrationList({ calibrations, loading, onDelete }: CalibrationListProps) {
  if (loading) {
    return <p className="p-6 text-sm text-text-muted">กำลังโหลด...</p>;
  }

  if (calibrations.length === 0) {
    return <p className="p-6 text-sm text-text-muted">ยังไม่มีผลสอบเทียบในระบบ</p>;
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-surface-muted text-surface-muted-text text-left">
          <th className="px-6 py-3 font-medium">อุปกรณ์</th>
          <th className="px-6 py-3 font-medium">รอบที่</th>
          <th className="px-6 py-3 font-medium">วันที่สอบเทียบ</th>
          <th className="px-6 py-3 font-medium">เลขที่ Certificate</th>
          <th className="px-6 py-3 font-medium">ผลสรุป</th>
          <th className="px-6 py-3 font-medium text-right">การจัดการ</th>
        </tr>
      </thead>
      <tbody>
        {calibrations.map((c) => (
          <tr key={c.calibrationId} className="border-t border-border">
            <td className="px-6 py-3 font-medium">
              {c.instrumentName} <span className="text-text-muted">({c.registrationNumber})</span>
            </td>
            <td className="px-6 py-3">{c.round}</td>
            <td className="px-6 py-3">{new Date(c.calibrationDate).toLocaleDateString("th-TH")}</td>
            <td className="px-6 py-3">{c.certificateNo}</td>
            <td className="px-6 py-3">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  c.summaryResult === "PASS"
                    ? "bg-mahidol-blue/10 text-action-text"
                    : "bg-danger-bg text-danger-text"
                }`}
              >
                {RESULT_BADGE_LABEL[c.summaryResult]}
              </span>
            </td>
            <td className="px-6 py-3 text-right space-x-3">
              <Link href={`/calibrations/${c.calibrationId}/edit`} className="text-action-text hover:underline">
                แก้ไข
              </Link>
              <button onClick={() => onDelete(c)} className="text-danger-text hover:underline">
                ลบ
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
