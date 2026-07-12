"use client";

import { useMemo } from "react";
import { ScheduleCalendarViewProps } from "@/types/components";
import { CalibrationScheduleRow } from "@/types/dashboard";

const WEEKDAYS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

export function ScheduleCalendarView({ year, month, rows, selectedDay, onSelectDay }: ScheduleCalendarViewProps) {
  const rowsByDay = useMemo(() => {
    const map = new Map<number, CalibrationScheduleRow[]>();
    rows.forEach((row) => {
      const day = new Date(row.scheduledDate).getDate();
      const list = map.get(day) ?? [];
      list.push(row);
      map.set(day, list);
    });
    return map;
  }, [rows]);

  const firstDayOfMonth = new Date(year, month - 1, 1).getDay(); // 0 = อาทิตย์
  const daysInMonth = new Date(year, month, 0).getDate();

  const cells: (number | null)[] = [
    ...Array.from({ length: firstDayOfMonth }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month;
  const selectedRows = selectedDay ? rowsByDay.get(selectedDay) ?? [] : [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-text-muted font-medium">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;

          const dayRows = rowsByDay.get(day) ?? [];
          const isToday = isCurrentMonth && today.getDate() === day;
          const isSelected = selectedDay === day;

          return (
            <button
              key={day}
              type="button"
              onClick={() => onSelectDay(isSelected ? null : day)}
              className={`aspect-square rounded-lg border text-sm flex flex-col items-center justify-center gap-0.5 transition-colors ${
                isSelected
                  ? "bg-mahidol-blue text-white border-mahidol-blue"
                  : "border-border hover:bg-surface-muted text-card-text"
              } ${isToday && !isSelected ? "ring-2 ring-mahidol-blue/40" : ""}`}
            >
              <span className={isSelected ? "font-semibold" : ""}>{day}</span>
              {dayRows.length > 0 && (
                <span
                  className={`text-[10px] leading-none px-1.5 py-0.5 rounded-full ${
                    isSelected ? "bg-white/20" : "bg-mahidol-blue/10 text-action-text"
                  }`}
                >
                  {dayRows.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {selectedDay && (
        <div className="border border-border rounded-xl p-4 bg-surface-muted space-y-2">
          <p className="text-sm font-semibold text-card-text">
            รายการวันที่ {selectedDay}{" "}
            {new Date(year, month - 1).toLocaleDateString("th-TH-u-ca-buddhist", {
              month: "long",
              year: "numeric",
            })}
          </p>

          {selectedRows.length === 0 ? (
            <p className="text-sm text-text-muted">ไม่มีรายการวันนี้</p>
          ) : (
            <ul className="space-y-1.5">
              {selectedRows.map((row) => (
                <li key={row.registrationNumber}>
                  <a
                    href={`/instruments/${row.registrationNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-wrap justify-between gap-x-3 gap-y-1 text-sm hover:underline"
                  >
                    <span className="font-medium text-card-text">
                      {row.instrumentName} <span className="text-text-muted">({row.registrationNumber})</span>
                    </span>
                    <span className="text-text-muted shrink-0">{row.projectName}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
