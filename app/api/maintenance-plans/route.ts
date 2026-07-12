import { NextRequest, NextResponse } from "next/server";
import {
  getAllMaintenancePlans,
  createMaintenancePlan,
  getOpenSchedules,
} from "@/services/maintenancePlanService";
import { MaintenancePlanFormData } from "@/types/maintenancePlan";

// GET /api/maintenance-plans                     -> รายการทั้งหมด (หน้า /schedules)
// GET /api/maintenance-plans?openSchedules=true   -> รอบกำหนดการที่ยังไม่มีผลสอบเทียบ (หน้า /calibrations)
export async function GET(request: NextRequest) {
  try {
    const isOpenSchedules = request.nextUrl.searchParams.get("openSchedules") === "true";
    const data = isOpenSchedules ? await getOpenSchedules() : await getAllMaintenancePlans();
    return NextResponse.json({ data });
  } catch (error) {
    console.error("[GET /api/maintenance-plans]", error);
    return NextResponse.json(
      { error: "ไม่สามารถดึงรายชื่อกำหนดการได้" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: MaintenancePlanFormData = await request.json();
    const plan = await createMaintenancePlan(body);
    return NextResponse.json({ data: plan }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/maintenance-plans]", error);

    if (error instanceof Error && error.message.includes("กรุณา")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}
