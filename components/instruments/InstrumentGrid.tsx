import { InstrumentGridProps } from "@/types/components";
import { InstrumentCard } from "./InstrumentCard";

export function InstrumentGrid({ instruments, loading, emptyMessage }: InstrumentGridProps) {
  if (loading) {
    return <p className="text-sm text-text-muted">กำลังโหลด...</p>;
  }

  if (instruments.length === 0) {
    return <p className="text-sm text-text-muted">{emptyMessage}</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {instruments.map((instrument) => (
        <InstrumentCard key={instrument.registrationNumber} instrument={instrument} />
      ))}
    </div>
  );
}
