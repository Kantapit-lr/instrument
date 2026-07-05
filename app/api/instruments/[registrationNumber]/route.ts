import { NextRequest, NextResponse } from "next/server";
import {
  getInstrumentByRegistrationNumber,
  updateInstrument,
  deleteInstrument,
} from "@/services/instrumentService";
import { InstrumentFormData } from "@/types/instrument";

interface RouteParams {
  params: Promise<{ registrationNumber: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { registrationNumber } = await params;
    const instrument = await getInstrumentByRegistrationNumber(registrationNumber);

    if (!instrument) {
      return NextResponse.json({ error: "ไม่พบอุปกรณ์ที่ระบุ" }, { status: 404 });
    }

    return NextResponse.json({ data: instrument });
  } catch (error) {
    console.error("[GET /api/instruments/[registrationNumber]]", error);
    return NextResponse.json({ error: "ไม่สามารถโหลดข้อมูลอุปกรณ์ได้" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { registrationNumber } = await params;
    const body: Omit<InstrumentFormData, "registrationNumber"> = await request.json();

    if (!body.name || !body.type || !body.projectId) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลที่จำเป็นให้ครบ (ชื่ออุปกรณ์, ประเภท, โครงการ)" },
        { status: 400 }
      );
    }

    const instrument = await updateInstrument(registrationNumber, body);

    return NextResponse.json({ data: instrument });
  } catch (error) {
    console.error("[PATCH /api/instruments/[registrationNumber]]", error);

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json({ error: "ข้อมูลซ้ำกับที่มีอยู่ในระบบแล้ว" }, { status: 409 });
    }

    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการแก้ไขข้อมูล กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { registrationNumber } = await params;
    await deleteInstrument(registrationNumber);
    return NextResponse.json({ data: { registrationNumber } });
  } catch (error) {
    console.error("[DELETE /api/instruments/[registrationNumber]]", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการลบข้อมูล กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}
