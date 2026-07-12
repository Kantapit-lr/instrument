import { NextRequest, NextResponse } from "next/server";
import {
  getCalibrationById,
  updateCalibration,
  deleteCalibration,
} from "@/services/calibrationService";
import { CalibrationFormData } from "@/types/calibration";
import { CalibrationIdRouteParams } from "@/types/api";

export async function GET(request: NextRequest, { params }: CalibrationIdRouteParams) {
  try {
    const { id } = await params;
    const calibrationId = Number(id);

    if (!Number.isInteger(calibrationId)) {
      return NextResponse.json({ error: "id ไม่ถูกต้อง" }, { status: 400 });
    }

    const calibration = await getCalibrationById(calibrationId);

    if (!calibration) {
      return NextResponse.json({ error: "ไม่พบผลสอบเทียบที่ระบุ" }, { status: 404 });
    }

    return NextResponse.json({ data: calibration });
  } catch (error) {
    console.error("[GET /api/calibrations/[id]]", error);
    return NextResponse.json({ error: "ไม่สามารถโหลดข้อมูลผลสอบเทียบได้" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: CalibrationIdRouteParams) {
  try {
    const { id } = await params;
    const calibrationId = Number(id);

    if (!Number.isInteger(calibrationId)) {
      return NextResponse.json({ error: "id ไม่ถูกต้อง" }, { status: 400 });
    }

    const formData = await request.formData();
    const raw = formData.get("data");

    if (typeof raw !== "string") {
      return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
    }

    const body: CalibrationFormData = JSON.parse(raw);
    const file = formData.get("certificateFile");
    const certificateFile = file instanceof File ? file : null;

    const calibration = await updateCalibration(calibrationId, body, certificateFile);

    return NextResponse.json({ data: calibration });
  } catch (error) {
    console.error("[PATCH /api/calibrations/[id]]", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการแก้ไขข้อมูล กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: CalibrationIdRouteParams) {
  try {
    const { id } = await params;
    const calibrationId = Number(id);

    if (!Number.isInteger(calibrationId)) {
      return NextResponse.json({ error: "id ไม่ถูกต้อง" }, { status: 400 });
    }

    await deleteCalibration(calibrationId);

    return NextResponse.json({ data: { calibrationId } });
  } catch (error) {
    console.error("[DELETE /api/calibrations/[id]]", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการลบข้อมูล กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}
