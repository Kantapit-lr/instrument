import { NextRequest, NextResponse } from "next/server";
import { getAllCalibrations, createCalibration } from "@/services/calibrationService";
import { CalibrationFormData } from "@/types/calibration";

export async function GET() {
  try {
    const data = await getAllCalibrations();
    return NextResponse.json({ data });
  } catch (error) {
    console.error("[GET /api/calibrations]", error);
    return NextResponse.json(
      { error: "ไม่สามารถดึงรายการผลสอบเทียบได้" },
      { status: 500 }
    );
  }
}

// รับเป็น multipart/form-data เพราะแนบไฟล์ certificate ไปด้วย
// field "data" เก็บ JSON ของ CalibrationFormData, field "certificateFile" เก็บไฟล์ (ถ้ามี)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const raw = formData.get("data");

    if (typeof raw !== "string") {
      return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
    }

    const body: CalibrationFormData = JSON.parse(raw);
    const file = formData.get("certificateFile");
    const certificateFile = file instanceof File ? file : null;

    const calibration = await createCalibration(body, certificateFile);

    return NextResponse.json({ data: calibration }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/calibrations]", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}
