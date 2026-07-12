import { MonthAgendaListProps } from "@/types/components";

export function MonthAgendaList({ year, month, rows, selectedDay, onSelectRow }: MonthAgendaListProps) {
  const monthLabel = new Date(year, month - 1).toLocaleDateString("th-TH-u-ca-buddhist", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-card text-card-text rounded-2xl border border-border shadow-sm p-5 flex-1 min-h-0 flex flex-col">
      <p className="text-sm font-semibold text-card-text mb-3">กำหนดการเดือน {monthLabel}</p>

      <div className="flex-1 min-h-0 overflow-y-auto -mr-1 pr-1 space-y-1.5">
        {rows.length === 0 ? (
          <p className="text-sm text-text-muted">ไม่มีรายการในเดือนนี้</p>
        ) : (
          rows.map((row) => {
            const day = new Date(row.scheduledDate).getDate();
            const isSelected = selectedDay === day;

            return (
              <button
                key={row.registrationNumber}
                type="button"
                onClick={() => onSelectRow(day)}
                className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                  isSelected
                    ? "bg-mahidol-blue/10 border-mahidol-blue/40"
                    : "border-border hover:bg-surface-muted"
                }`}
              >
                <p className="font-medium text-card-text truncate">{row.instrumentName}</p>
                <p className="text-xs text-text-muted truncate">{row.registrationNumber}</p>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
