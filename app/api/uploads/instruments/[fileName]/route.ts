import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import { getImageFilePath } from "@/services/imageService";
import { UploadFileNameRouteParams } from "@/types/api";

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(request: NextRequest, { params }: UploadFileNameRouteParams) {
  const { fileName } = await params;

  // กัน path traversal: ชื่อไฟล์ต้องไม่มี / หรือ .. เด็ดขาด
  // (ไฟล์ของเราเป็น randomUUID เสมอ ชื่อแบบนี้ไม่ควรหลุดเข้ามาได้อยู่แล้ว แต่เช็คซ้ำเพื่อความปลอดภัย)
  if (fileName.includes("..") || fileName.includes("/") || fileName.includes("\\")) {
    return NextResponse.json({ error: "ชื่อไฟล์ไม่ถูกต้อง" }, { status: 400 });
  }

  const filePath = getImageFilePath(fileName);

  if (!existsSync(filePath)) {
    return NextResponse.json({ error: "ไม่พบไฟล์รูปภาพ" }, { status: 404 });
  }

  const extension = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
  const contentType = MIME_TYPES[extension] ?? "application/octet-stream";

  const fileBuffer = await readFile(filePath);

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
