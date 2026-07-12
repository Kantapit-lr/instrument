import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import { getCertificateFilePath } from "@/services/calibrationService";
import { UploadFileNameRouteParams } from "@/types/api";

const MIME_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(request: NextRequest, { params }: UploadFileNameRouteParams) {
  const { fileName } = await params;

  // กัน path traversal: ชื่อไฟล์ต้องไม่มี / หรือ .. เด็ดขาด
  if (fileName.includes("..") || fileName.includes("/") || fileName.includes("\\")) {
    return NextResponse.json({ error: "ชื่อไฟล์ไม่ถูกต้อง" }, { status: 400 });
  }

  const filePath = getCertificateFilePath(fileName);

  if (!existsSync(filePath)) {
    return NextResponse.json({ error: "ไม่พบไฟล์ certificate" }, { status: 404 });
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
