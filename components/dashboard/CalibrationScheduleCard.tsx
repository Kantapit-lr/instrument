import { CalibrationScheduleCardProps } from "@/types/components";

export function CalibrationScheduleCard({ title, rows }: CalibrationScheduleCardProps) {
  return (
    <div className="bg-card text-card-text rounded-2xl border border-border shadow-sm p-5 md:p-6 h-full">
      <h3 className="text-lg font-bold mb-4">{title}</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs uppercase text-text-muted">
              <th className="pb-3 font-medium pr-4">เลขครุภัณฑ์</th>
              <th className="pb-3 font-medium pr-4">เครื่องมือ</th>
              <th className="pb-3 font-medium">ผู้สอบเทียบ</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-6 text-center text-sm text-text-muted">
                  ไม่มีรายการในช่วงนี้
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.registrationNumber}
                  className="border-t border-border hover:bg-surface-muted transition-colors"
                >
                  <td className="py-3 pr-4 text-sm font-medium">{row.registrationNumber}</td>
                  <td className="py-3 pr-4 text-sm text-card-text">{row.instrumentName}</td>
                  <td className="py-3 text-sm text-text-muted">{row.operator}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
