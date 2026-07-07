import { NextRequest, NextResponse } from "next/server";
import {
  getRequestListById,
  updateRequestList,
  deleteRequestList,
} from "@/services/annualPlanService";
import { RequestListFormData } from "@/types/annualPlan";
import { RequestListIdRouteParams } from "@/types/api";

export async function GET(request: NextRequest, { params }: RequestListIdRouteParams) {
  try {
    const { id } = await params;
    const requestListId = Number(id);

    if (!Number.isInteger(requestListId)) {
      return NextResponse.json({ error: "id ไม่ถูกต้อง" }, { status: 400 });
    }

    const requestList = await getRequestListById(requestListId);

    if (!requestList) {
      return NextResponse.json({ error: "ไม่พบแผนรายปีที่ระบุ" }, { status: 404 });
    }

    return NextResponse.json({ data: requestList });
  } catch (error) {
    console.error("[GET /api/request-lists/[id]]", error);
    return NextResponse.json({ error: "ไม่สามารถโหลดข้อมูลแผนได้" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RequestListIdRouteParams) {
  try {
    const { id } = await params;
    const requestListId = Number(id);

    if (!Number.isInteger(requestListId)) {
      return NextResponse.json({ error: "id ไม่ถูกต้อง" }, { status: 400 });
    }

    const body: RequestListFormData = await request.json();

    if (!body.projectId || !body.year || !body.operator || !body.status) {
      return NextResponse.json(
        { error: "กรุณาเลือกโครงการ และกรอกปี ผู้เสนอ สถานะให้ครบ" },
        { status: 400 }
      );
    }

    const requestList = await updateRequestList(requestListId, body);

    return NextResponse.json({ data: requestList });
  } catch (error) {
    console.error("[PATCH /api/request-lists/[id]]", error);

    if (error instanceof Error && error.message.includes("กรุณา")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการแก้ไขข้อมูล กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RequestListIdRouteParams) {
  try {
    const { id } = await params;
    const requestListId = Number(id);

    if (!Number.isInteger(requestListId)) {
      return NextResponse.json({ error: "id ไม่ถูกต้อง" }, { status: 400 });
    }

    await deleteRequestList(requestListId);

    return NextResponse.json({ data: { requestListId } });
  } catch (error) {
    console.error("[DELETE /api/request-lists/[id]]", error);

    if (error instanceof Error && error.message.startsWith("ไม่สามารถลบได้")) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการลบข้อมูล กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}
