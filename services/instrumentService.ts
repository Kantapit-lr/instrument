import { prisma } from "@/lib/prisma";
import { Prisma } from "@/prisma/generated/prisma/client";
import { InstrumentFormData, InstrumentListItem } from "@/types/instrument";

// select กลางที่ใช้ทั้ง search/list ทั้งหมด ดึงแค่ field ที่จำเป็นต้องโชว์ในการ์ด
// (ไม่ดึงทั้ง record เพราะ list อาจมีหลายสิบ-ร้อยรายการ ดึงเท่าที่ใช้จริงจะเร็วกว่า)
const LIST_ITEM_SELECT = {
  registrationNumber: true,
  name: true,
  type: true,
  project: { select: { name: true } },
  images: {
    select: { fileName: true },
    orderBy: { sortOrder: "asc" as const },
    take: 1, // เอาแค่รูปแรกมาเป็นรูปหน้าปก ไม่ต้องดึงทั้ง gallery มาตอน list
  },
} satisfies Prisma.ProfileSelect;

type ProfileWithListFields = Prisma.ProfileGetPayload<{ select: typeof LIST_ITEM_SELECT }>;

function toListItem(profile: ProfileWithListFields): InstrumentListItem {
  return {
    registrationNumber: profile.registrationNumber,
    name: profile.name,
    type: profile.type,
    projectName: profile.project.name,
    coverImageFileName: profile.images[0]?.fileName ?? null,
  };
}

// ค้นหาอุปกรณ์ด้วยรหัสครุภัณฑ์หรือชื่อ (แบบ partial match ไม่สนตัวพิมพ์ใหญ่เล็ก)
// limit ใช้แยกระหว่าง autocomplete dropdown (limit น้อย) กับหน้าผลลัพธ์เต็ม (limit มาก/ไม่จำกัด)
export async function searchInstruments(query: string, limit?: number) {
  const profiles = await prisma.profile.findMany({
    where: {
      OR: [
        { registrationNumber: { contains: query } },
        { name: { contains: query } },
      ],
    },
    select: LIST_ITEM_SELECT,
    orderBy: { name: "asc" },
    take: limit,
  });

  return profiles.map(toListItem);
}

// ดึงอุปกรณ์ทั้งหมดในระบบ สำหรับหน้า /instruments
export async function getAllInstruments() {
  const profiles = await prisma.profile.findMany({
    select: LIST_ITEM_SELECT,
    orderBy: { name: "asc" },
  });

  return profiles.map(toListItem);
}

// ดึงข้อมูลเต็มของอุปกรณ์ 1 รายการ สำหรับหน้าแก้ไข (ต้องใช้ทุก field ของฟอร์ม)
export async function getInstrumentByRegistrationNumber(registrationNumber: string) {
  return prisma.profile.findUnique({ where: { registrationNumber } });
}

// สร้างอุปกรณ์ (Profile) ใหม่ในฐานข้อมูล
// รับข้อมูลดิบจากฟอร์ม (ทุกอย่างเป็น string) แล้วแปลง type ให้ตรงกับ schema ก่อนบันทึก
export async function createInstrument(data: InstrumentFormData) {
  if (!data.type) {
    throw new Error("กรุณาเลือกประเภทอุปกรณ์");
  }

  return prisma.profile.create({
    data: {
      registrationNumber: data.registrationNumber,
      name: data.name,
      type: data.type,
      brand: data.brand || null,
      model: data.model || null,
      serialNo: data.serialNo || null,
      projectId: Number(data.projectId),

      size: data.size || null,
      manufacturer: data.manufacturer || null,
      vendor: data.vendor || null,
      country: data.country || null,
      price: new Prisma.Decimal(data.price || "0"),
      fundingType: data.fundingType,
      fundingTypeRemark: data.fundingTypeRemark || null,

      location: data.location,
      receivedDate: new Date(data.receivedDate),
      activeDate: new Date(data.activeDate),
      initialCondition: data.initialCondition,

      withdrawalDocumentNo: data.withdrawalDocumentNo,
      recordedBy: data.recordedBy,
      remark: data.remark || null,

      // สร้าง SpecialCharacteristic พร้อมกันใน transaction เดียว
      specialCharacteristics: data.specialCharacteristics.length > 0 ? {
        create: data.specialCharacteristics
          .filter((s) => s.type.trim() && s.value.trim())
          .map((s) => ({
            type: s.type.trim(),
            value: s.value.trim(),
            remark: s.remark.trim() || null,
          })),
      } : undefined,
    },
  });
}

// แก้ไขข้อมูลอุปกรณ์ที่มีอยู่แล้ว (registrationNumber เป็น primary key แก้ไม่ได้ จึงไม่รับมาอัปเดต)
export async function updateInstrument(
  registrationNumber: string,
  data: Omit<InstrumentFormData, "registrationNumber">
) {
  if (!data.type) {
    throw new Error("กรุณาเลือกประเภทอุปกรณ์");
  }

  // SpecialCharacteristic ใช้ composite PK (registrationNumber, type)
  // วิธีง่ายสุดที่ถูกต้องคือ ลบทั้งหมดของอุปกรณ์นี้แล้วสร้างใหม่ใน transaction เดียวกัน
  return prisma.$transaction(async (tx) => {
    await tx.specialCharacteristic.deleteMany({ where: { registrationNumber } });

    return tx.profile.update({
      where: { registrationNumber },
      data: {
        name: data.name,
        type: data.type,
        brand: data.brand || null,
        model: data.model || null,
        serialNo: data.serialNo || null,
        projectId: Number(data.projectId),

        size: data.size || null,
        manufacturer: data.manufacturer || null,
        vendor: data.vendor || null,
        country: data.country || null,
        price: new Prisma.Decimal(data.price || "0"),
        fundingType: data.fundingType,
        fundingTypeRemark: data.fundingTypeRemark || null,

        location: data.location,
        receivedDate: new Date(data.receivedDate),
        activeDate: new Date(data.activeDate),
        initialCondition: data.initialCondition,

        withdrawalDocumentNo: data.withdrawalDocumentNo,
        recordedBy: data.recordedBy,
        remark: data.remark || null,

        specialCharacteristics: data.specialCharacteristics.length > 0 ? {
          create: data.specialCharacteristics
            .filter((s) => s.type.trim() && s.value.trim())
            .map((s) => ({
              type: s.type.trim(),
              value: s.value.trim(),
              remark: s.remark.trim() || null,
            })),
        } : undefined,
      },
    });
  });
}

// ดึงข้อมูลเต็มของอุปกรณ์ 1 รายการ รวม specialCharacteristics สำหรับหน้าแก้ไข
export async function getInstrumentByRegistrationNumber(registrationNumber: string) {
  return prisma.profile.findUnique({
    where: { registrationNumber },
    include: { specialCharacteristics: true },
  });
}

// ลบอุปกรณ์ออกจากระบบ (รูปภาพที่ผูกไว้จะถูกลบตามด้วย onDelete: Cascade ใน schema
// แต่นั่นลบแค่ record ใน DB เท่านั้น — ไฟล์รูปจริงบนดิสก์ต้องลบแยกตรงนี้ก่อน ไม่ให้ไฟล์ลอยค้างอยู่)
export async function deleteInstrument(registrationNumber: string) {
  const images = await prisma.profileImage.findMany({ where: { registrationNumber } });

  const { unlink } = await import("fs/promises");
  const { existsSync } = await import("fs");
  const { getImageFilePath } = await import("./imageService");

  for (const image of images) {
    const filePath = getImageFilePath(image.fileName);
    try {
      if (existsSync(filePath)) {
        await unlink(filePath);
      }
    } catch (error) {
      console.error("[deleteInstrument] ลบไฟล์รูปจากดิสก์ไม่สำเร็จ:", error);
    }
  }

  return prisma.profile.delete({ where: { registrationNumber } });
}
