"use client";

import { useEffect, useState } from "react";
import { InstrumentListItem } from "@/types/instrument";
import { InstrumentGrid } from "@/components/instruments/InstrumentGrid";

export default function InstrumentsPage() {
  const [instruments, setInstruments] = useState<InstrumentListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/instruments")
      .then((res) => res.json())
      .then((json) => setInstruments(json.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <h1 className="text-2xl font-bold text-card-text">อุปกรณ์ทั้งหมด</h1>
      <InstrumentGrid
        instruments={instruments}
        loading={loading}
        emptyMessage="ยังไม่มีอุปกรณ์ในระบบ"
      />
    </div>
  );
}
