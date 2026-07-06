import { NextRequest, NextResponse } from "next/server";
import { deleteProfileImage } from "@/services/imageService";
import { InstrumentImageIdRouteParams } from "@/types/api";

export async function DELETE(request: NextRequest, { params }: InstrumentImageIdRouteParams) {
  try {
    const { id } = await params;
    const profileImageId = Number(id);

    if (!Number.isInteger(profileImageId)) {
      return NextResponse.json({ error: "id ไม่ถูกต้อง" }, { status: 400 });
    }

    await deleteProfileImage(profileImageId);

    return NextResponse.json({ data: { profileImageId } });
  } catch (error) {
    console.error("[DELETE /api/instruments/images/[id]]", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการลบรูปภาพ" }, { status: 500 });
  }
}
