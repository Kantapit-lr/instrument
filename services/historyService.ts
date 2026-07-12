import { prisma } from "@/lib/prisma";
import { HistoryFormData } from "@/types/profileDetail";

// ดึงประวัติทั้งหมดของอุปกรณ์ 1 ชิ้น เรียงล่าสุดขึ้นก่อน
export async function getHistoryByInstrument(registrationNumber: string) {
  return prisma.history.findMany({
    where: { registrationNumber },
    orderBy: { actionDate: "desc" },
    select: {
      historyId: true,
      actionDate: true,
      actionType: true,
      detail: true,
      operator: true,
      remark: true,
      calibrationId: true,
    },
  });
}

// เพิ่มประวัติด้วยมือ (เช่น ย้าย location, บำรุงรักษานอกระบบ) — actionType ห้ามเป็น CAL
// เพราะรายการ CAL ต้องมาจากหน้า /calibrations เท่านั้น เพื่อให้ข้อมูลตรงกับผลสอบเทียบจริงเสมอ
export async function createManualHistory(registrationNumber: string, data: HistoryFormData) {
  return prisma.history.create({
    data: {
      registrationNumber,
      actionDate: new Date(data.actionDate),
      actionType: data.actionType,
      detail: data.detail || null,
      operator: data.operator,
      remark: data.remark || null,
    },
  });
}

// แก้ไขประวัติที่เพิ่มด้วยมือ — เช็คก่อนว่าไม่ใช่รายการที่ผูกกับ Calibration (calibrationId != null)
// เพราะรายการนั้นต้องแก้ผ่านหน้า /calibrations/[id]/edit เท่านั้น ไม่งั้นข้อมูลจะไม่ตรงกัน
export async function updateManualHistory(historyId: number, data: HistoryFormData) {
  const existing = await prisma.history.findUnique({ where: { historyId }, select: { calibrationId: true } });

  if (!existing) {
    throw new Error("ไม่พบรายการประวัติที่ระบุ");
  }
  if (existing.calibrationId !== null) {
    throw new Error("รายการนี้มาจากการบันทึกผลสอบเทียบ แก้ไขได้ที่หน้าบันทึกผลสอบเทียบเท่านั้น");
  }

  return prisma.history.update({
    where: { historyId },
    data: {
      actionDate: new Date(data.actionDate),
      actionType: data.actionType,
      detail: data.detail || null,
      operator: data.operator,
      remark: data.remark || null,
    },
  });
}

// ลบประวัติที่เพิ่มด้วยมือ — เช็คเงื่อนไขเดียวกับตอนแก้ไข
export async function deleteManualHistory(historyId: number) {
  const existing = await prisma.history.findUnique({ where: { historyId }, select: { calibrationId: true } });

  if (!existing) {
    throw new Error("ไม่พบรายการประวัติที่ระบุ");
  }
  if (existing.calibrationId !== null) {
    throw new Error("รายการนี้มาจากการบันทึกผลสอบเทียบ ลบได้โดยการลบผลสอบเทียบที่หน้าบันทึกผลสอบเทียบเท่านั้น");
  }

  return prisma.history.delete({ where: { historyId } });
}
