import { prisma } from "@/lib/prisma";
import { Prisma } from "@/prisma/generated/prisma/client";
import { RequestListFormData, RequestListItem } from "@/types/annualPlan";

// ดึงรายชื่อแผนรายปีทั้งหมด พร้อมจำนวนอุปกรณ์ในแต่ละแผน (สำหรับหน้า /annual-plans)
export async function getAllRequestLists(): Promise<RequestListItem[]> {
  const requestLists = await prisma.requestList.findMany({
    orderBy: { year: "desc" },
    select: {
      requestListId: true,
      year: true,
      operator: true,
      status: true,
      project: { select: { name: true } },
      _count: { select: { requestDetails: true } },
    },
  });

  return requestLists.map((requestList) => ({
    requestListId: requestList.requestListId,
    projectName: requestList.project.name,
    year: requestList.year,
    operator: requestList.operator,
    status: requestList.status,
    detailCount: requestList._count.requestDetails,
  }));
}

// ดึงรายชื่อแผนรายปีที่ "อนุมัติแล้ว" แบบสั้น สำหรับ dropdown เลือกแผนตอนสร้างกำหนดการ (หน้า /schedules)
export async function getApprovedRequestListOptions() {
  const requestLists = await prisma.requestList.findMany({
    where: { status: "อนุมัติแล้ว" },
    orderBy: { year: "desc" },
    select: {
      requestListId: true,
      year: true,
      project: { select: { name: true } },
    },
  });

  return requestLists.map((requestList) => ({
    value: String(requestList.requestListId),
    label: `พ.ศ. ${requestList.year} — ${requestList.project.name}`,
  }));
}

// ดึงข้อมูลเต็มของแผนรายปี 1 รายการ พร้อมรายละเอียดอุปกรณ์ทั้งหมด สำหรับหน้าแก้ไข
// (รวมชื่ออุปกรณ์ของแต่ละ RequestDetail ไว้ด้วย เพราะหน้ากำหนดการต้องใช้แสดงผล)
export async function getRequestListById(requestListId: number) {
  return prisma.requestList.findUnique({
    where: { requestListId },
    include: {
      requestDetails: {
        include: { profile: { select: { name: true } } },
      },
    },
  });
}

// สร้างแผนรายปีใหม่ พร้อมรายละเอียดอุปกรณ์ทั้งหมดในแผน (transaction เดียว)
export async function createRequestList(data: RequestListFormData) {
  if (!data.status) {
    throw new Error("กรุณาเลือกสถานะของแผน");
  }
  if (!data.projectId) {
    throw new Error("กรุณาเลือกโครงการ");
  }

  const status = data.status;

  return prisma.requestList.create({
    data: {
      projectId: Number(data.projectId),
      year: Number(data.year),
      operator: data.operator,
      status,
      requestDetails: data.details.length > 0
        ? {
            create: data.details.map((d) => ({
              registrationNumber: d.registrationNumber,
              operator: data.operator,
              requirementType: d.requirementType,
              frequency: Number(d.frequency),
              usagePeriod: d.usagePeriod,
              acceptableTolerance: new Prisma.Decimal(d.acceptableTolerance || "0"),
              remark: d.remark || null,
            })),
          }
        : undefined,
    },
  });
}

// แก้ไขแผนรายปีที่มีอยู่แล้ว
// RequestDetail ไม่มี composite key ที่แก้ทีละแถวได้ง่าย จึงใช้วิธีเดียวกับ specialCharacteristics
// ของอุปกรณ์: ลบของเดิมทั้งหมดของแผนนี้แล้วสร้างใหม่ใน transaction เดียวกัน
export async function updateRequestList(requestListId: number, data: RequestListFormData) {
  if (!data.status) {
    throw new Error("กรุณาเลือกสถานะของแผน");
  }
  if (!data.projectId) {
    throw new Error("กรุณาเลือกโครงการ");
  }

  const status = data.status;

  return prisma.$transaction(async (tx) => {
    await tx.requestDetail.deleteMany({ where: { requestListId } });

    return tx.requestList.update({
      where: { requestListId },
      data: {
        projectId: Number(data.projectId),
        year: Number(data.year),
        operator: data.operator,
        status,
        requestDetails: data.details.length > 0
          ? {
              create: data.details.map((d) => ({
                registrationNumber: d.registrationNumber,
                operator: data.operator,
                requirementType: d.requirementType,
                frequency: Number(d.frequency),
                usagePeriod: d.usagePeriod,
                acceptableTolerance: new Prisma.Decimal(d.acceptableTolerance || "0"),
                remark: d.remark || null,
              })),
            }
          : undefined,
      },
    });
  });
}

// ลบแผนรายปี — เช็คก่อนว่ามีกำหนดการ (MaintenancePlan) อ้างอิงแผนนี้อยู่หรือไม่
// ถ้ามีให้ throw error ที่อ่านง่ายแทนปล่อยให้ Prisma throw foreign key constraint error แบบดิบๆ
export async function deleteRequestList(requestListId: number) {
  const maintenancePlanCount = await prisma.maintenancePlan.count({ where: { requestListId } });

  if (maintenancePlanCount > 0) {
    throw new Error(
      `ไม่สามารถลบได้ เนื่องจากมีกำหนดการที่สร้างจากแผนนี้อยู่แล้ว ${maintenancePlanCount} รายการ`
    );
  }

  return prisma.$transaction(async (tx) => {
    await tx.requestDetail.deleteMany({ where: { requestListId } });
    return tx.requestList.delete({ where: { requestListId } });
  });
}
