"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, List, CalendarDays } from "lucide-react";
import { CalibrationScheduleCardProps } from "@/types/components";
import { CalibrationScheduleRow } from "@/types/dashboard";
import { ScheduleCalendarView } from "./ScheduleCalendarView";

function ScheduleTable({ rows }: { rows: CalibrationScheduleRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-xs uppercase text-text-muted">
            <th className="pb-3 font-medium pr-4">เลขครุภัณฑ์</th>
            <th className="pb-3 font-medium pr-4">เครื่องมือ</th>
            <th className="pb-3 font-medium">โครงการ</th>
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
                <td className="py-3 text-sm text-text-muted">{row.projectName}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export function CalibrationScheduleCard({
  viewMode,
  onViewModeChange,
  year,
  month,
  onGoToMonth,
  rows,
  loading,
  selectedDay,
  onSelectDay,
}: CalibrationScheduleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const title = `เครื่องมือสอบเทียบประจำเดือน ${new Date(year, month - 1).toLocaleDateString(
    "th-TH-u-ca-buddhist",
    { month: "long", year: "numeric" }
  )}`;

  return (
    <>
      {isExpanded && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setIsExpanded(false)} aria-hidden="true" />
      )}

      <div
        className={
          isExpanded
            ? "fixed inset-4 md:inset-10 z-50 bg-card text-card-text rounded-2xl border border-border shadow-sm p-5 md:p-6 overflow-auto"
            : "bg-card text-card-text rounded-2xl border border-border shadow-sm p-5 md:p-6 h-full"
        }
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onGoToMonth(-1)}
              className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg border border-border hover:bg-surface-muted transition-colors"
              aria-label="เดือนก่อนหน้า"
            >
              <ChevronLeft size={16} />
            </button>
            <h3 className="text-xs md:text-lg font-bold whitespace-nowrap">{title}</h3>
            <button
              type="button"
              onClick={() => onGoToMonth(1)}
              className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg border border-border hover:bg-surface-muted transition-colors"
              aria-label="เดือนถัดไป"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-border overflow-hidden">
              <button
                type="button"
                onClick={() => onViewModeChange("list")}
                className={`px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors ${
                  viewMode === "list" ? "bg-mahidol-blue text-white" : "hover:bg-surface-muted text-card-text"
                }`}
              >
                <List size={14} /> รายการ
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange("calendar")}
                className={`px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors ${
                  viewMode === "calendar" ? "bg-mahidol-blue text-white" : "hover:bg-surface-muted text-card-text"
                }`}
              >
                <CalendarDays size={14} /> ปฏิทิน
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded((v) => !v)}
              className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg border border-border hover:bg-surface-muted transition-colors"
              aria-label={isExpanded ? "ย่อกลับ" : "ขยายเต็มจอ"}
            >
              {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-text-muted">กำลังโหลด...</p>
        ) : viewMode === "list" ? (
          <ScheduleTable rows={rows} />
        ) : (
          <ScheduleCalendarView
            year={year}
            month={month}
            rows={rows}
            selectedDay={selectedDay}
            onSelectDay={onSelectDay}
          />
        )}
      </div>
    </>
  );
}
