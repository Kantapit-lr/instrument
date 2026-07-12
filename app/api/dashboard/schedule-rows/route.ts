import { NextRequest, NextResponse } from "next/server";
import { getScheduleRowsForMonth } from "@/services/dashboardService";

// GET /api/dashboard/schedule-rows?year=2026&month=7
export async function GET(request: NextRequest) {
  try {
    const year = Number(request.nextUrl.searchParams.get("year"));
    const month = Number(request.nextUrl.searchParams.get("month"));

    if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
      return NextResponse.json({ error: "year/month ไม่ถูกต้อง" }, { status: 400 });
    }

    const data = await getScheduleRowsForMonth(year, month);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("[GET /api/dashboard/schedule-rows]", error);
    return NextResponse.json({ error: "ไม่สามารถโหลดข้อมูลได้" }, { status: 500 });
  }
}
