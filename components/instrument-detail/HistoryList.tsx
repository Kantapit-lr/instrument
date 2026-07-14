import Link from "next/link";
import { HistoryListProps } from "@/types/components";

const ACTION_LABEL: Record<string, string> = {
  CAL: "CAL",
  PM: "PM",
  TRANSFER: "TRANSFER",
  MANUAL: "MANUAL",
  OTHER: "OTHER",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("th-TH-u-ca-buddhist", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function HistoryList({ items, loading, onEdit, onDelete }: HistoryListProps) {
  if (loading) {
    return <p className="text-sm text-text-muted">กำลังโหลด...</p>;
  }

  if (items.length === 0) {
    return <p className="text-sm text-text-muted">ยังไม่มีประวัติของอุปกรณ์นี้</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.historyId} className="border border-border rounded-xl p-4 flex flex-wrap gap-3 justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded-full bg-mahidol-blue/10 text-action-text font-medium">
                {ACTION_LABEL[item.actionType] ?? item.actionType}
              </span>
              <span className="text-xs text-text-muted">{formatDate(item.actionDate)}</span>
            </div>
            {item.detail && <p className="text-sm text-card-text">{item.detail}</p>}
            <p className="text-xs text-text-muted mt-1">
              โดย {item.operator}
              {item.remark && ` · ${item.remark}`}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3 text-sm">
            {item.calibrationId ? (
              <Link href={`/calibrations/${item.calibrationId}/edit`} className="text-action-text hover:underline">
                ดูผลสอบเทียบ
              </Link>
            ) : (
              <>
                <button type="button" onClick={() => onEdit(item)} className="text-action-text hover:underline">
                  แก้ไข
                </button>
                <button type="button" onClick={() => onDelete(item)} className="text-danger-text hover:underline">
                  ลบ
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
