import { NextRequest, NextResponse } from "next/server";
import {
  createInstrument,
  getAllInstruments,
  getInstrumentOptions,
  searchInstruments,
} from "@/services/instrumentService";
import { InstrumentFormData } from "@/types/instrument";

// GET /api/instruments                  -> รายการทั้งหมด (หน้า /instruments)
// GET /api/instruments?q=xxx             -> ค้นหา ไม่จำกัดผล (หน้า /instruments/search)
// GET /api/instruments?q=xxx&limit=5     -> ค้นหา จำกัดผล (autocomplete dropdown)
// GET /api/instruments?options=true      -> { value, label }[] สำหรับ dropdown (หน้า /annual-plans)
// GET /api/instruments?options=true&projectId=3 -> เฉพาะอุปกรณ์ของโครงการนั้น
export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("q");
    const limitParam = request.nextUrl.searchParams.get("limit");
    const limit = limitParam ? Number(limitParam) : undefined;
    const isOptions = request.nextUrl.searchParams.get("options") === "true";
    const projectIdParam = request.nextUrl.searchParams.get("projectId");
    const projectId = projectIdParam ? Number(projectIdParam) : undefined;

    const data = isOptions
      ? await getInstrumentOptions(projectId)
      : query
        ? await searchInstruments(query, limit)
        : await getAllInstruments();

    return NextResponse.json({ data });
  } catch (error) {
    console.error("[GET /api/instruments]", error);
    return NextResponse.json({ error: "ไม่สามารถโหลดข้อมูลอุปกรณ์ได้" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: InstrumentFormData = await request.json();

    // เช็ค field ที่จำเป็นแบบหยาบๆ ก่อนยิงเข้า DB (validate ละเอียดกว่านี้ค่อยทำเพิ่มได้)
    if (!body.registrationNumber || !body.name || !body.type || !body.projectId) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลที่จำเป็นให้ครบ (รหัสครุภัณฑ์, ชื่ออุปกรณ์, ประเภท, โครงการ)" },
        { status: 400 }
      );
    }

    const instrument = await createInstrument(body);

    return NextResponse.json({ data: instrument }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/instruments]", error);

    // กรณีรหัสครุภัณฑ์ซ้ำ (primary key ชน)
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "รหัสครุภัณฑ์นี้มีอยู่ในระบบแล้ว" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}
