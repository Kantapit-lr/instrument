import { NextRequest, NextResponse } from "next/server";
import {
  getMaintenancePlanById,
  updateMaintenancePlan,
  deleteMaintenancePlan,
} from "@/services/maintenancePlanService";
import { MaintenancePlanFormData } from "@/types/maintenancePlan";
import { MaintenancePlanIdRouteParams } from "@/types/api";

export async function GET(request: NextRequest, { params }: MaintenancePlanIdRouteParams) {
  try {
    const { id } = await params;
    const maintenancePlanId = Number(id);

    if (!Number.isInteger(maintenancePlanId)) {
      return NextResponse.json({ error: "id ไม่ถูกต้อง" }, { status: 400 });
    }

    const plan = await getMaintenancePlanById(maintenancePlanId);

    if (!plan) {
      return NextResponse.json({ error: "ไม่พบกำหนดการที่ระบุ" }, { status: 404 });
    }

    return NextResponse.json({ data: plan });
  } catch (error) {
    console.error("[GET /api/maintenance-plans/[id]]", error);
    return NextResponse.json({ error: "ไม่สามารถโหลดข้อมูลกำหนดการได้" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: MaintenancePlanIdRouteParams) {
  try {
    const { id } = await params;
    const maintenancePlanId = Number(id);

    if (!Number.isInteger(maintenancePlanId)) {
      return NextResponse.json({ error: "id ไม่ถูกต้อง" }, { status: 400 });
    }

    const body: MaintenancePlanFormData = await request.json();
    const plan = await updateMaintenancePlan(maintenancePlanId, body);

    return NextResponse.json({ data: plan });
  } catch (error) {
    console.error("[PATCH /api/maintenance-plans/[id]]", error);

    if (error instanceof Error && error.message.includes("กรุณา")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการแก้ไขข้อมูล กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: MaintenancePlanIdRouteParams) {
  try {
    const { id } = await params;
    const maintenancePlanId = Number(id);

    if (!Number.isInteger(maintenancePlanId)) {
      return NextResponse.json({ error: "id ไม่ถูกต้อง" }, { status: 400 });
    }

    await deleteMaintenancePlan(maintenancePlanId);

    return NextResponse.json({ data: { maintenancePlanId } });
  } catch (error) {
    console.error("[DELETE /api/maintenance-plans/[id]]", error);

    if (error instanceof Error && error.message.startsWith("ไม่สามารถลบได้")) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการลบข้อมูล กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}
