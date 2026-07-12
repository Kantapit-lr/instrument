"use client";

import { useState } from "react";
import { InstrumentInfoTab } from "./InstrumentInfoTab";
import { InstrumentHistoryTab } from "./InstrumentHistoryTab";
import { InstrumentDetailTabsProps } from "@/types/components";

const TABS = [
  { key: "info", label: "ข้อมูลพื้นฐาน" },
  { key: "history", label: "ประวัติ" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function InstrumentDetailTabs({ detail }: InstrumentDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("info");

  return (
    <div>
      <div className="flex gap-1 border-b border-border mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-mahidol-blue text-mahidol-blue"
                : "border-transparent text-text-muted hover:text-card-text"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "info" ? (
        <InstrumentInfoTab detail={detail} />
      ) : (
        <InstrumentHistoryTab registrationNumber={detail.registrationNumber} />
      )}
    </div>
  );
}
