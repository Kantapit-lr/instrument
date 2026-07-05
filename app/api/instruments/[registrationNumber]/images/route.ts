import { NextRequest, NextResponse } from "next/server";
import { addProfileImage, getProfileImages } from "@/services/imageService";

interface RouteParams {
  params: Promise<{ registrationNumber: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { registrationNumber } = await params;
    const images = await getProfileImages(registrationNumber);
    return NextResponse.json({ data: images });
  } catch (error) {
    console.error("[GET /api/instruments/[registrationNumber]/images]", error);
    return NextResponse.json({ error: "ไม่สามารถโหลดรูปภาพได้" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { registrationNumber } = await params;

    // รับไฟล์ผ่าน multipart/form-data ไม่ใช่ JSON เพราะเป็นไฟล์ไบนารี
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "ไม่พบไฟล์ที่อัปโหลด" }, { status: 400 });
    }

    const image = await addProfileImage(registrationNumber, file);

    return NextResponse.json({ data: image }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/instruments/[registrationNumber]/images]", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ" }, { status: 500 });
  }
}
