import { NextRequest, NextResponse } from "next/server";
import { getAllMaintenancePlans, createMaintenancePlan } from "@/services/maintenancePlanService";
import { MaintenancePlanFormData } from "@/types/maintenancePlan";

export async function GET() {
  try {
    const data = await getAllMaintenancePlans();
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
