import Link from "next/link";
import { InstrumentDetailHeaderProps } from "@/types/components";

const TYPE_LABEL: Record<string, string> = {
  BALANCE: "Balance",
  TEMPERATURE: "Temperature",
  PIPETTE: "Pipette",
};

export function InstrumentDetailHeader({ detail }: InstrumentDetailHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-card-text">{detail.name}</h1>
          <span className="text-xs px-2.5 py-1 rounded-full bg-mahidol-blue/10 text-action-text font-medium">
            {TYPE_LABEL[detail.type] ?? detail.type}
          </span>
          {detail.disposed && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-danger-bg text-danger-text font-medium">
              ปลดระวางแล้ว
            </span>
          )}
        </div>
        <p className="text-sm text-text-muted">
          {detail.registrationNumber} · {detail.projectName}
        </p>
      </div>

      <Link
        href={`/instruments/${detail.registrationNumber}/edit`}
        className="px-5 py-2.5 text-sm font-semibold text-white bg-mahidol-blue rounded-xl shadow-sm transition-all duration-200 hover:bg-mahidol-blue/90 hover:shadow-md active:scale-[0.98]"
      >
        แก้ไขอุปกรณ์
      </Link>
    </div>
  );
}
