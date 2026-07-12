import { NextRequest, NextResponse } from "next/server";
import { updateManualHistory, deleteManualHistory } from "@/services/historyService";
import { HistoryFormData } from "@/types/profileDetail";
import { HistoryIdRouteParams } from "@/types/api";

export async function PATCH(request: NextRequest, { params }: HistoryIdRouteParams) {
  try {
    const { id } = await params;
    const historyId = Number(id);

    if (!Number.isInteger(historyId)) {
      return NextResponse.json({ error: "id ไม่ถูกต้อง" }, { status: 400 });
    }

    const body: HistoryFormData = await request.json();

    if (!body.actionDate || !body.actionType || !body.operator) {
      return NextResponse.json({ error: "กรุณากรอกวันที่ ประเภท และผู้บันทึกให้ครบ" }, { status: 400 });
    }

    const history = await updateManualHistory(historyId, body);
    return NextResponse.json({ data: history });
  } catch (error) {
    console.error("[PATCH /api/history/[id]]", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการแก้ไขข้อมูล กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: HistoryIdRouteParams) {
  try {
    const { id } = await params;
    const historyId = Number(id);

    if (!Number.isInteger(historyId)) {
      return NextResponse.json({ error: "id ไม่ถูกต้อง" }, { status: 400 });
    }

    await deleteManualHistory(historyId);
    return NextResponse.json({ data: { historyId } });
  } catch (error) {
    console.error("[DELETE /api/history/[id]]", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการลบข้อมูล กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}
