import { NextRequest, NextResponse } from "next/server";
import { getHistoryByInstrument, createManualHistory } from "@/services/historyService";
import { HistoryFormData } from "@/types/profileDetail";
import { InstrumentRegistrationRouteParams } from "@/types/api";

export async function GET(request: NextRequest, { params }: InstrumentRegistrationRouteParams) {
  try {
    const { registrationNumber } = await params;
    const data = await getHistoryByInstrument(registrationNumber);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("[GET /api/instruments/[registrationNumber]/history]", error);
    return NextResponse.json({ error: "ไม่สามารถโหลดประวัติได้" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: InstrumentRegistrationRouteParams) {
  try {
    const { registrationNumber } = await params;
    const body: HistoryFormData = await request.json();

    if (!body.actionDate || !body.actionType || !body.operator) {
      return NextResponse.json({ error: "กรุณากรอกวันที่ ประเภท และผู้บันทึกให้ครบ" }, { status: 400 });
    }

    const history = await createManualHistory(registrationNumber, body);
    return NextResponse.json({ data: history }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/instruments/[registrationNumber]/history]", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}
