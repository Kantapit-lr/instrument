"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { InstrumentListItem } from "@/types/instrument";
import { InstrumentGrid } from "@/components/instruments/InstrumentGrid";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") ?? "";

  const [keyword, setKeyword] = useState(query);
  const [instruments, setInstruments] = useState<InstrumentListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setKeyword(query);

    if (!query) {
      setInstruments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/instruments?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((json) => setInstruments(json.data ?? []))
      .finally(() => setLoading(false));
  }, [query]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/instruments/search?q=${encodeURIComponent(keyword)}`);
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <h1 className="text-2xl font-bold text-card-text">ผลการค้นหา</h1>

      <form onSubmit={handleSearchSubmit} className="flex gap-3 max-w-xl">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="ค้นหาด้วยรหัสครุภัณฑ์หรือชื่ออุปกรณ์..."
          className="flex-1 px-4 py-2.5 bg-surface-muted text-surface-muted-text border border-border rounded-xl outline-none focus:ring-2 focus:ring-mahidol-blue/20"
        />
        <button
          type="submit"
          className="px-5 py-2.5 text-sm font-semibold text-white bg-mahidol-blue rounded-xl hover:bg-mahidol-blue/90 transition-colors"
        >
          ค้นหา
        </button>
      </form>

      {query && (
        <p className="text-sm text-text-muted">
          ผลการค้นหาสำหรับ &ldquo;{query}&rdquo; — พบ {instruments.length} รายการ
        </p>
      )}

      <InstrumentGrid
        instruments={instruments}
        loading={loading}
        emptyMessage={query ? "ไม่พบอุปกรณ์ที่ตรงกับคำค้นหา" : "กรุณากรอกคำค้นหา"}
      />
    </div>
  );
}

// useSearchParams ต้องอยู่ใน Suspense boundary ตามข้อกำหนดของ Next.js App Router
// ไม่งั้นจะ error ตอน build / prerender หน้านี้
export default function InstrumentSearchPage() {
  return (
    <Suspense fallback={<p className="text-sm text-text-muted">กำลังโหลด...</p>}>
      <SearchResultsContent />
    </Suspense>
  );
}
