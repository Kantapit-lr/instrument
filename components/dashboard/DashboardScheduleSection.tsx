"use client";

import { useEffect, useState } from "react";
import { StatCard } from "./StatCard";
import { GoalGaugeCard } from "./GoalGaugeCard";
import { CalibrationScheduleCard } from "./CalibrationScheduleCard";
import { MonthAgendaList } from "./MonthAgendaList";
import { DashboardScheduleSectionProps, DashboardViewMode } from "@/types/components";
import { CalibrationScheduleRow } from "@/types/dashboard";

export function DashboardScheduleSection({
  initialRows,
  initialYear,
  initialMonth,
  completed,
  goalPercent,
}: DashboardScheduleSectionProps) {
  const [viewMode, setViewMode] = useState<DashboardViewMode>("list");
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [rows, setRows] = useState<CalibrationScheduleRow[]>(initialRows);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    if (year === initialYear && month === initialMonth) {
      setRows(initialRows);
      return;
    }

    setLoading(true);
    fetch(`/api/dashboard/schedule-rows?year=${year}&month=${month}`)
      .then((res) => res.json())
      .then((json) => setRows(json.data ?? []))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  function goToMonth(offset: number) {
    let newMonth = month + offset;
    let newYear = year;

    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    } else if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }

    setMonth(newMonth);
    setYear(newYear);
    setSelectedDay(null);
  }

  function handleViewModeChange(mode: DashboardViewMode) {
    setViewMode(mode);
    setSelectedDay(null);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch">
      <div className="lg:col-span-3">
        <CalibrationScheduleCard
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          year={year}
          month={month}
          onGoToMonth={goToMonth}
          rows={rows}
          loading={loading}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
        />
      </div>

      <div className="flex flex-col gap-4 min-h-0">
        <StatCard title="เสร็จสิ้นแล้ว (ปีนี้)" value={completed} />
        <GoalGaugeCard title="เป้าหมายประจำปี" percent={goalPercent} />

        {viewMode === "calendar" && (
          <MonthAgendaList
            year={year}
            month={month}
            rows={rows}
            selectedDay={selectedDay}
            onSelectRow={setSelectedDay}
          />
        )}
      </div>
    </div>
  );
}
