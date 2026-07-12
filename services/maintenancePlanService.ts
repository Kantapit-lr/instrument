import { prisma } from "@/lib/prisma";
import { MaintenancePlanFormData, MaintenancePlanItem } from "@/types/maintenancePlan";
import { OpenScheduleOption } from "@/types/calibration";

// ดึงรอบกำหนดการ (Schedule) ที่ยังไม่มีผลสอบเทียบผูกอยู่ สำหรับ dropdown เลือกตอนบันทึกผล (หน้า /calibrations)
export async function getOpenSchedules(): Promise<OpenScheduleOption[]> {
  const schedules = await prisma.schedule.findMany({
    where: { calibration: null },
    orderBy: { scheduledDate: "asc" },
    select: {
      scheduleId: true,
      round: true,
      scheduledDate: true,
      maintenanceDetail: {
        select: {
          maintenancePlanId: true,
          registrationNumber: true,
          profile: { select: { name: true, type: true } },
        },
      },
    },
  });

  return schedules.map((s) => ({
    scheduleId: s.scheduleId,
    round: s.round,
    registrationNumber: s.maintenanceDetail.registrationNumber,
    maintenancePlanId: s.maintenanceDetail.maintenancePlanId,
    instrumentType: s.maintenanceDetail.profile.type,
    label: `${s.maintenanceDetail.profile.name} (${s.maintenanceDetail.registrationNumber}) — รอบที่ ${s.round} — กำหนด ${s.scheduledDate.toLocaleDateString("th-TH")}`,
  }));
}

// ดึงรายชื่อกำหนดการทั้งหมด พร้อมจำนวนอุปกรณ์ในแต่ละแผน (สำหรับหน้า /schedules)
export async function getAllMaintenancePlans(): Promise<MaintenancePlanItem[]> {
  const plans = await prisma.maintenancePlan.findMany({
    orderBy: { year: "desc" },
    select: {
      maintenancePlanId: true,
      year: true,
      operator: true,
      approvalStatus: true,
      hiringStatus: true,
      processStatus: true,
      project: { select: { name: true } },
      _count: { select: { maintenanceDetails: true } },
    },
  });

  return plans.map((plan) => ({
    maintenancePlanId: plan.maintenancePlanId,
    projectName: plan.project?.name ?? "-",
    year: plan.year,
    operator: plan.operator,
    approvalStatus: plan.approvalStatus,
    hiringStatus: plan.hiringStatus,
    processStatus: plan.processStatus,
    detailCount: plan._count.maintenanceDetails,
  }));
}

// ดึงข้อมูลเต็มของกำหนดการ 1 รายการ พร้อมรายละเอียดอุปกรณ์และรอบกำหนดการทั้งหมด สำหรับหน้าแก้ไข
export async function getMaintenancePlanById(maintenancePlanId: number) {
  return prisma.maintenancePlan.findUnique({
    where: { maintenancePlanId },
    include: {
      maintenanceDetails: {
        include: { schedules: true, profile: { select: { name: true } } },
      },
    },
  });
}

// สร้างกำหนดการใหม่ พร้อมรายละเอียดอุปกรณ์และรอบกำหนดการทั้งหมด (transaction เดียว)
export async function createMaintenancePlan(data: MaintenancePlanFormData) {
  validate(data);

  return prisma.maintenancePlan.create({
    data: {
      requestListId: Number(data.requestListId),
      projectId: Number(data.projectId),
      year: Number(data.year),
      operator: data.operator,
      reviewer: data.reviewer || null,
      approvalStatus: data.approvalStatus as string,
      hiringStatus: data.hiringStatus as string,
      processStatus: data.processStatus as string,
      maintenanceDetails: {
        create: data.details.map((d) => ({
          registrationNumber: d.registrationNumber,
          status: d.status,
          detail: d.detail,
          remark: d.remark || null,
          schedules: {
            create: d.schedules.map((s) => ({
              round: Number(s.round),
              scheduledDate: new Date(s.scheduledDate),
            })),
          },
        })),
      },
    },
  });
}

// แก้ไขกำหนดการที่มีอยู่แล้ว
// ลบ MaintenanceDetail (และ Schedule ที่ผูกอยู่) เดิมทั้งหมดของแผนนี้แล้วสร้างใหม่ใน transaction เดียวกัน
export async function updateMaintenancePlan(maintenancePlanId: number, data: MaintenancePlanFormData) {
  validate(data);

  return prisma.$transaction(async (tx) => {
    const oldDetails = await tx.maintenanceDetail.findMany({
      where: { maintenancePlanId },
      select: { maintenanceDetailId: true },
    });
    const oldDetailIds = oldDetails.map((d) => d.maintenanceDetailId);

    if (oldDetailIds.length > 0) {
      await tx.schedule.deleteMany({ where: { maintenanceDetailId: { in: oldDetailIds } } });
      await tx.maintenanceDetail.deleteMany({ where: { maintenancePlanId } });
    }

    return tx.maintenancePlan.update({
      where: { maintenancePlanId },
      data: {
        requestListId: Number(data.requestListId),
        projectId: Number(data.projectId),
        year: Number(data.year),
        operator: data.operator,
        reviewer: data.reviewer || null,
        approvalStatus: data.approvalStatus as string,
        hiringStatus: data.hiringStatus as string,
        processStatus: data.processStatus as string,
        maintenanceDetails: {
          create: data.details.map((d) => ({
            registrationNumber: d.registrationNumber,
            status: d.status,
            detail: d.detail,
            remark: d.remark || null,
            schedules: {
              create: d.schedules.map((s) => ({
                round: Number(s.round),
                scheduledDate: new Date(s.scheduledDate),
              })),
            },
          })),
        },
      },
    });
  });
}

// ลบกำหนดการ — เช็คก่อนว่ามีการบันทึกผลสอบเทียบ (Calibration) อ้างอิงแผนนี้อยู่หรือไม่
// ถ้ามีให้ throw error ที่อ่านง่ายแทนปล่อยให้ Prisma throw foreign key constraint error แบบดิบๆ
export async function deleteMaintenancePlan(maintenancePlanId: number) {
  const calibrationCount = await prisma.calibration.count({ where: { maintenancePlanId } });

  if (calibrationCount > 0) {
    throw new Error(
      `ไม่สามารถลบได้ เนื่องจากมีการบันทึกผลสอบเทียบจากกำหนดการนี้อยู่แล้ว ${calibrationCount} รายการ`
    );
  }

  return prisma.$transaction(async (tx) => {
    const details = await tx.maintenanceDetail.findMany({
      where: { maintenancePlanId },
      select: { maintenanceDetailId: true },
    });
    const detailIds = details.map((d) => d.maintenanceDetailId);

    if (detailIds.length > 0) {
      await tx.schedule.deleteMany({ where: { maintenanceDetailId: { in: detailIds } } });
      await tx.maintenanceDetail.deleteMany({ where: { maintenancePlanId } });
    }

    return tx.maintenancePlan.delete({ where: { maintenancePlanId } });
  });
}

function validate(data: MaintenancePlanFormData) {
  if (!data.requestListId) throw new Error("กรุณาเลือกแผนรายปี");
  if (!data.projectId) throw new Error("กรุณาเลือกโครงการ");
  if (!data.approvalStatus) throw new Error("กรุณาเลือกสถานะการอนุมัติ");
  if (!data.hiringStatus) throw new Error("กรุณาเลือกสถานะการจัดจ้าง");
  if (!data.processStatus) throw new Error("กรุณาเลือกสถานะการดำเนินงาน");
  if (data.details.length === 0) throw new Error("กรุณาเพิ่มอุปกรณ์เข้ากำหนดการอย่างน้อย 1 รายการ");

  for (const detail of data.details) {
    if (!detail.status) throw new Error(`กรุณาเลือกสถานะของอุปกรณ์ ${detail.registrationNumber}`);
    if (detail.schedules.length === 0) {
      throw new Error(`กรุณาเพิ่มรอบกำหนดการอย่างน้อย 1 รอบให้อุปกรณ์ ${detail.registrationNumber}`);
    }
  }
}
