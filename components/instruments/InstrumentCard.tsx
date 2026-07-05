import Link from "next/link";
import { InstrumentListItem } from "@/types/instrument";
import { getImageUrl } from "@/types/image";

const TYPE_LABEL: Record<string, string> = {
  BALANCE: "Balance",
  TEMPERATURE: "Temperature",
  PIPETTE: "Pipette",
};

export function InstrumentCard({ instrument }: { instrument: InstrumentListItem }) {
  return (
    <div className="bg-card text-card-text rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
      <div className="aspect-square bg-surface-muted flex items-center justify-center">
        {instrument.coverImageFileName ? (
          <img
            src={getImageUrl(instrument.coverImageFileName)}
            alt={instrument.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-sm text-text-muted">ไม่มีรูปภาพ</span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-1 flex-1">
        <p className="font-semibold truncate" title={instrument.name}>
          {instrument.name}
        </p>
        <p className="text-xs text-text-muted">{instrument.registrationNumber}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs px-2 py-0.5 rounded-full bg-mahidol-blue/10 text-action-text">
            {TYPE_LABEL[instrument.type] ?? instrument.type}
          </span>
          <span className="text-xs text-text-muted truncate">{instrument.projectName}</span>
        </div>

        <Link
          href={`/instruments/${instrument.registrationNumber}/edit`}
          className="mt-3 text-center text-sm font-semibold text-white bg-mahidol-blue rounded-xl py-2 hover:bg-mahidol-blue/90 transition-colors"
        >
          แก้ไข
        </Link>
      </div>
    </div>
  );
}
