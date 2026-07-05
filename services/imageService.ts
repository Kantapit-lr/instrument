import { writeFile, unlink, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";

// โฟลเดอร์เก็บไฟล์รูปจริง อยู่นอก public/ ที่ root ของโปรเจค
// เพื่อให้ copy ทั้งโปรเจคไปเครื่องอื่นแล้วรูปยังอยู่ ไม่ผูกกับ build process ของ public/
const UPLOAD_DIR = path.join(process.cwd(), "uploads", "instruments");

// ชนิดไฟล์ที่อนุญาตให้อัปโหลด (กันคนแนบไฟล์ executable หรือไฟล์อันตรายอื่นๆ)
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB ต่อรูป

function getExtensionFromMimeType(mimeType: string): string {
  switch (mimeType) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    default:
      throw new Error("ชนิดไฟล์ไม่รองรับ");
  }
}

// เพิ่มรูปใหม่ให้กับอุปกรณ์ 1 ชิ้น: ตรวจสอบไฟล์ -> เขียนลงดิสก์ -> บันทึก record ลง DB
export async function addProfileImage(registrationNumber: string, file: File) {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error("รองรับเฉพาะไฟล์รูปภาพ JPEG, PNG, WEBP เท่านั้น");
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("ไฟล์รูปภาพต้องมีขนาดไม่เกิน 5MB");
  }

  // ตรวจสอบว่าอุปกรณ์นี้มีอยู่จริงก่อน ป้องกันการอัปโหลดไฟล์ลอยที่ไม่ผูกกับอะไร
  const profile = await prisma.profile.findUnique({ where: { registrationNumber } });
  if (!profile) {
    throw new Error("ไม่พบอุปกรณ์ที่ระบุ");
  }

  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }

  // สุ่มชื่อไฟล์ใหม่เสมอ ไม่ใช้ชื่อไฟล์เดิมจากเครื่อง user
  // ป้องกันไฟล์ชื่อซ้ำทับกัน และป้องกัน path traversal จากชื่อไฟล์ที่ user ตั้งมา
  const fileName = `${randomUUID()}${getExtensionFromMimeType(file.type)}`;
  const filePath = path.join(UPLOAD_DIR, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  // ลำดับการแสดงผล: ต่อจากรูปสุดท้ายที่มีอยู่ของอุปกรณ์นี้
  const lastImage = await prisma.profileImage.findFirst({
    where: { registrationNumber },
    orderBy: { sortOrder: "desc" },
  });
  const nextSortOrder = (lastImage?.sortOrder ?? -1) + 1;

  return prisma.profileImage.create({
    data: { registrationNumber, fileName, sortOrder: nextSortOrder },
  });
}

// ดึงรายชื่อรูปทั้งหมดของอุปกรณ์ 1 ชิ้น เรียงตามลำดับที่ตั้งไว้
export async function getProfileImages(registrationNumber: string) {
  return prisma.profileImage.findMany({
    where: { registrationNumber },
    orderBy: { sortOrder: "asc" },
  });
}

// ลบรูป 1 รูป: ลบไฟล์จริงจากดิสก์ก่อน แล้วค่อยลบ record จาก DB
// ถ้าลบไฟล์จากดิสก์ไม่ได้ (เช่นไฟล์ถูกลบไปแล้วด้วยมือ) ยังคงลบ record ต่อไป ไม่ปล่อยให้ DB ค้างของเสีย
export async function deleteProfileImage(profileImageId: number) {
  const image = await prisma.profileImage.findUnique({ where: { profileImageId } });
  if (!image) {
    throw new Error("ไม่พบรูปภาพที่ระบุ");
  }

  const filePath = path.join(UPLOAD_DIR, image.fileName);
  try {
    if (existsSync(filePath)) {
      await unlink(filePath);
    }
  } catch (error) {
    console.error("[deleteProfileImage] ลบไฟล์จากดิสก์ไม่สำเร็จ:", error);
  }

  return prisma.profileImage.delete({ where: { profileImageId } });
}

// path เต็มของไฟล์รูป ใช้ตอน serve ไฟล์ผ่าน API route
export function getImageFilePath(fileName: string): string {
  return path.join(UPLOAD_DIR, fileName);
}
