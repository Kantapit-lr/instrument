import { writeFile, unlink, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/prisma/generated/prisma/client";
import { CalibrationFormData, CalibrationItem, CalibrationResultStatus } from "@/types/calibration";

// โฟลเดอร์เก็บไฟล์ certificate จริง แยกจากรูปอุปกรณ์ (uploads/certificates)
const UPLOAD_DIR = path.join(process.cwd(), "uploads", "certificates");
const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB — certificate สแกนมักไฟล์ใหญ่กว่ารูปอุปกรณ์ทั่วไป

function getExtensionFromMimeType(mimeType: string): string {
  switch (mimeType) {
    case "application/pdf":
      return ".pdf";
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

// บันทึกไฟล์ certificate ลงดิสก์ คืนค่าเป็นชื่อไฟล์ (ใช้เก็บใน certificatePath)
async function saveCertificateFile(file: File): Promise<string> {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error("รองรับเฉพาะไฟล์ PDF, JPEG, PNG, WEBP เท่านั้น");
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("ไฟล์ certificate ต้องมีขนาดไม่เกิน 10MB");
  }

  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }

  const fileName = `${randomUUID()}${getExtensionFromMimeType(file.type)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, fileName), buffer);

  return fileName;
}

async function deleteCertificateFileFromDisk(fileName: string) {
  try {
    const filePath = path.join(UPLOAD_DIR, fileName);
    if (existsSync(filePath)) {
      await unlink(filePath);
    }
  } catch (error) {
    console.error("[deleteCertificateFileFromDisk] ลบไฟล์จากดิสก์ไม่สำเร็จ:", error);
  }
}

// path เต็มของไฟล์ certificate ใช้ตอน serve ไฟล์ผ่าน API route
export function getCertificateFilePath(fileName: string): string {
  return path.join(UPLOAD_DIR, fileName);
}

// ดึงรายการผลสอบเทียบทั้งหมด สำหรับหน้า /calibrations
export async function getAllCalibrations(): Promise<CalibrationItem[]> {
  const calibrations = await prisma.calibration.findMany({
    orderBy: { calibrationDate: "desc" },
    select: {
      calibrationId: true,
      registrationNumber: true,
      certificateNo: true,
      calibrationDate: true,
      summaryResult: true,
      certificatePath: true,
      profile: { select: { name: true } },
      schedule: { select: { round: true } },
    },
  });

  return calibrations.map((c) => ({
    calibrationId: c.calibrationId,
    instrumentName: c.profile.name,
    registrationNumber: c.registrationNumber,
    round: c.schedule.round,
    certificateNo: c.certificateNo,
    calibrationDate: c.calibrationDate.toISOString(),
    summaryResult: c.summaryResult,
    hasCertificateFile: !!c.certificatePath,
  }));
}

// ดึงข้อมูลเต็มของผลสอบเทียบ 1 ใบ พร้อมผลทดสอบทุกจุด สำหรับหน้าแก้ไข
export async function getCalibrationById(calibrationId: number) {
  return prisma.calibration.findUnique({
    where: { calibrationId },
    include: {
      resultBalances: true,
      resultTemperatureSources: true,
      resultPipettes: true,
      profile: { select: { name: true, type: true } },
      schedule: { select: { round: true, scheduledDate: true } },
    },
  });
}

// สร้างผลสอบเทียบใหม่ + ผลทดสอบทุกจุด + บันทึกลงประวัติอุปกรณ์อัตโนมัติ (transaction เดียว)
export async function createCalibration(data: CalibrationFormData, certificateFile?: File | null) {
  validate(data);

  const certificatePath = certificateFile ? await saveCertificateFile(certificateFile) : null;

  return prisma.$transaction(async (tx) => {
    const calibration = await tx.calibration.create({
      data: buildCalibrationData(data, certificatePath),
    });

    // บันทึกประวัติอัตโนมัติ — ไม่ต้องให้ผู้ใช้กรอกซ้ำ ผูก calibrationId ไว้เพื่อย้อนกลับมาดูได้
    await tx.history.create({
      data: {
        registrationNumber: data.registrationNumber,
        calibrationId: calibration.calibrationId,
        actionDate: new Date(data.calibrationDate),
        actionType: "CAL",
        operator: data.operator || "ระบบ",
        detail: `บันทึกผลสอบเทียบ เลขที่ certificate ${data.certificateNo} ผลรวม: ${data.summaryResult}`,
      },
    });

    return calibration;
  });
}

// แก้ไขผลสอบเทียบที่มีอยู่แล้ว — ลบผลทดสอบเดิมทั้งหมดแล้วสร้างใหม่ในรอบเดียวกัน (ไม่สร้าง History ซ้ำ)
export async function updateCalibration(
  calibrationId: number,
  data: CalibrationFormData,
  certificateFile?: File | null
) {
  validate(data);

  const existing = await prisma.calibration.findUnique({ where: { calibrationId } });
  if (!existing) {
    throw new Error("ไม่พบผลสอบเทียบที่ระบุ");
  }

  let certificatePath = existing.certificatePath;
  if (certificateFile) {
    if (existing.certificatePath) await deleteCertificateFileFromDisk(existing.certificatePath);
    certificatePath = await saveCertificateFile(certificateFile);
  }

  return prisma.$transaction(async (tx) => {
    await tx.resultBalance.deleteMany({ where: { calibrationId } });
    await tx.resultTemperatureSource.deleteMany({ where: { calibrationId } });
    await tx.resultPipette.deleteMany({ where: { calibrationId } });

    // อัปเดต History ที่ผูกไว้ตอนสร้าง ให้ข้อมูลตรงกับผลที่แก้ไขล่าสุด
    await tx.history.updateMany({
      where: { calibrationId },
      data: {
        actionDate: new Date(data.calibrationDate),
        detail: `บันทึกผลสอบเทียบ เลขที่ certificate ${data.certificateNo} ผลรวม: ${data.summaryResult}`,
      },
    });

    return tx.calibration.update({
      where: { calibrationId },
      data: buildCalibrationData(data, certificatePath),
    });
  });
}

// ลบผลสอบเทียบ — ลบไฟล์ certificate จากดิสก์ (ถ้ามี) ด้วย
// หมายเหตุ: History ที่เคยบันทึกไว้อัตโนมัติตอนสร้าง จะไม่ถูกลบตาม เก็บไว้เป็นร่องรอยการดำเนินการ
export async function deleteCalibration(calibrationId: number) {
  const existing = await prisma.calibration.findUnique({ where: { calibrationId } });
  if (!existing) {
    throw new Error("ไม่พบผลสอบเทียบที่ระบุ");
  }

  if (existing.certificatePath) {
    await deleteCertificateFileFromDisk(existing.certificatePath);
  }

  return prisma.$transaction(async (tx) => {
    // History ที่ผูกไว้ตอนสร้าง เก็บไว้เป็นร่องรอยการดำเนินการต่อไป แค่เลิกผูกกับ Calibration
    // ที่กำลังจะถูกลบ (ไม่งั้น FK constraint จะกันการลบ เพราะ History.calibrationId ยังชี้มาอยู่)
    await tx.history.updateMany({
      where: { calibrationId },
      data: { calibrationId: null },
    });

    await tx.resultBalance.deleteMany({ where: { calibrationId } });
    await tx.resultTemperatureSource.deleteMany({ where: { calibrationId } });
    await tx.resultPipette.deleteMany({ where: { calibrationId } });
    return tx.calibration.delete({ where: { calibrationId } });
  });
}

function buildCalibrationData(data: CalibrationFormData, certificatePath: string | null) {
  return {
    registrationNumber: data.registrationNumber,
    maintenancePlanId: Number(data.maintenancePlanId),
    scheduleId: Number(data.scheduleId),
    certificateNo: data.certificateNo,
    calibrationDate: new Date(data.calibrationDate),
    isAccurate: data.isAccurate,
    isDocumentComplete: data.isDocumentComplete,
    isInstrumentComplete: data.isInstrumentComplete,
    instrumentValue: data.instrumentValue,
    mpe: data.mpe,
    summaryResult: data.summaryResult as CalibrationResultStatus,
    operator: data.operator || null,
    operatedAt: data.operatedAt ? new Date(data.operatedAt) : null,
    reviewer: data.reviewer || null,
    reviewedAt: data.reviewedAt ? new Date(data.reviewedAt) : null,
    certificatePath,
    resultBalances:
      data.resultBalances.length > 0
        ? {
            create: data.resultBalances.map((r) => ({
              appliedWeight: new Prisma.Decimal(r.appliedWeight || "0"),
              balanceReading: new Prisma.Decimal(r.balanceReading || "0"),
              unit: r.unit,
              correction: new Prisma.Decimal(r.correction || "0"),
              mu: new Prisma.Decimal(r.mu || "0"),
              totalErrorMinus: new Prisma.Decimal(r.totalErrorMinus || "0"),
              totalErrorPlus: new Prisma.Decimal(r.totalErrorPlus || "0"),
              status: r.status as CalibrationResultStatus,
            })),
          }
        : undefined,
    resultTemperatureSources:
      data.resultTemperatures.length > 0
        ? {
            create: data.resultTemperatures.map((r) => ({
              position: r.position,
              standardReading: new Prisma.Decimal(r.standardReading || "0"),
              unit: r.unit,
              mu: new Prisma.Decimal(r.mu || "0"),
              averageStandardReadingMc: new Prisma.Decimal(r.averageStandardReadingMc || "0"),
              status: r.status as CalibrationResultStatus,
            })),
          }
        : undefined,
    resultPipettes:
      data.resultPipettes.length > 0
        ? {
            create: data.resultPipettes.map((r) => ({
              parameter: r.parameter,
              pointOfCalibration: r.pointOfCalibration,
              unit: r.unit,
              mpePercent: new Prisma.Decimal(r.mpePercent || "0"),
              error: new Prisma.Decimal(r.error || "0"),
              ms: new Prisma.Decimal(r.ms || "0"),
              totalError: new Prisma.Decimal(r.totalError || "0"),
              status: r.status as CalibrationResultStatus,
            })),
          }
        : undefined,
  };
}

function validate(data: CalibrationFormData) {
  if (!data.scheduleId) throw new Error("กรุณาเลือกรอบกำหนดการ");
  if (!data.certificateNo) throw new Error("กรุณากรอกเลขที่ certificate");
  if (!data.calibrationDate) throw new Error("กรุณาเลือกวันที่สอบเทียบ");
  if (!data.summaryResult) throw new Error("กรุณาเลือกผลสรุปการสอบเทียบ");

  const totalResultRows =
    data.resultBalances.length + data.resultTemperatures.length + data.resultPipettes.length;

  if (totalResultRows === 0) {
    throw new Error("กรุณาเพิ่มผลการทดสอบอย่างน้อย 1 จุด");
  }
}
