import { NextRequest, NextResponse } from "next/server";
import {
  getAllRequestLists,
  createRequestList,
  getApprovedRequestListOptions,
} from "@/services/annualPlanService";
import { RequestListFormData } from "@/types/annualPlan";

// GET /api/request-lists                -> รายการทั้งหมด (หน้า /annual-plans)
// GET /api/request-lists?options=true   -> เฉพาะแผนที่ "อนุมัติแล้ว" แบบสั้น สำหรับ dropdown (หน้า /schedules)
export async function GET(request: NextRequest) {
  try {
    const isOptions = request.nextUrl.searchParams.get("options") === "true";
    const data = isOptions ? await getApprovedRequestListOptions() : await getAllRequestLists();
    return NextResponse.json({ data });
  } catch (error) {
    console.error("[GET /api/request-lists]", error);
    return NextResponse.json(
      { error: "ไม่สามารถดึงรายชื่อแผนรายปีได้" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestListFormData = await request.json();

    if (!body.projectId || !body.year || !body.operator || !body.status) {
      return NextResponse.json(
        { error: "กรุณาเลือกโครงการ และกรอกปี ผู้เสนอ สถานะให้ครบ" },
        { status: 400 }
      );
    }

    const requestList = await createRequestList(body);

    return NextResponse.json({ data: requestList }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/request-lists]", error);

    if (error instanceof Error && error.message.includes("กรุณา")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}
