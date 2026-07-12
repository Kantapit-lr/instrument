import { prisma } from "@/lib/prisma";
import { CalibrationScheduleRow } from "@/types/dashboard";

// ปีปัจจุบันแบบ พ.ศ. (ตรงกับ field year ที่เก็บใน MaintenancePlan/RequestList ทั้งระบบ)
function getCurrentBuddhistYear(): number {
  return new Date().getFullYear() + 543;
}

// ช่วงวันที่ของเดือนใดเดือนหนึ่ง โดยนับจาก "เดือนนี้ + offset" (offset=0 คือเดือนนี้, 1 คือเดือนหน้า)
function monthRange(base: Date, offsetMonths: number) {
  const start = new Date(base.getFullYear(), base.getMonth() + offsetMonths, 1);
  const end = new Date(base.getFullYear(), base.getMonth() + offsetMonths + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

// ช่วงวันที่ของไตรมาสถัดไป (ไตรมาสปฏิทิน: ม.ค.-มี.ค., เม.ย.-มิ.ย., ก.ค.-ก.ย., ต.ค.-ธ.ค.)
function nextQuarterRange(base: Date) {
  const currentQuarterStartMonth = Math.floor(base.getMonth() / 3) * 3;
  const start = new Date(base.getFullYear(), currentQuarterStartMonth + 3, 1);
  const end = new Date(base.getFullYear(), currentQuarterStartMonth + 6, 0, 23, 59, 59, 999);
  return { start, end };
}

export interface DashboardStats {
  thisMonth: number;
  nextMonth: number;
  nextQuarter: number;
  queue: number;
  completed: number;
  goalPercent: number;
}

// สรุปตัวเลขภาพรวมของ Dashboard (การ์ดตัวเลข 6 ใบ) — นับเฉพาะ Schedule ของแผนที่อยู่ในปี
// พ.ศ. ปัจจุบันเท่านั้น (ตามที่ตกลงกันไว้ ไม่รวมปีอื่น) ไม่เกี่ยวกับตาราง/ปฏิทินรายเดือนด้านล่าง
// ซึ่งเลื่อนดูเดือน/ปีอื่นได้อิสระผ่าน getScheduleRowsForMonth()
export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const year = getCurrentBuddhistYear();

  const thisMonth = monthRange(now, 0);
  const nextMonth = monthRange(now, 1);
  const nextQuarter = nextQuarterRange(now);

  const yearFilter = { maintenanceDetail: { maintenancePlan: { year } } };

  const [thisMonthCount, nextMonthCount, nextQuarterCount, queueCount, completedCount] =
    await Promise.all([
      prisma.schedule.count({
        where: { ...yearFilter, calibration: null, scheduledDate: { gte: thisMonth.start, lte: thisMonth.end } },
      }),
      prisma.schedule.count({
        where: { ...yearFilter, calibration: null, scheduledDate: { gte: nextMonth.start, lte: nextMonth.end } },
      }),
      prisma.schedule.count({
        where: { ...yearFilter, calibration: null, scheduledDate: { gte: nextQuarter.start, lte: nextQuarter.end } },
      }),
      prisma.schedule.count({
        where: { ...yearFilter, calibration: null },
      }),
      prisma.schedule.count({
        where: { ...yearFilter, calibration: { isNot: null } },
      }),
    ]);

  // Goal % = สัดส่วนรอบที่ทำเสร็จแล้ว เทียบกับรอบทั้งหมดของปีนี้ (เสร็จ + ยังไม่เสร็จ)
  const totalForGoal = queueCount + completedCount;
  const goalPercent = totalForGoal > 0 ? Math.round((completedCount / totalForGoal) * 100) : 0;

  return {
    thisMonth: thisMonthCount,
    nextMonth: nextMonthCount,
    nextQuarter: nextQuarterCount,
    queue: queueCount,
    completed: completedCount,
    goalPercent,
  };
}

// รายการกำหนดการของเดือน/ปีใดก็ได้ (ปีเป็น ค.ศ. ตรงกับ scheduledDate จริง ไม่ใช่ พ.ศ. ของแผน)
// ใช้ทั้งตอนโหลดครั้งแรก (เดือนปัจจุบัน) และตอนเลื่อนดูเดือนอื่นผ่านปฏิทินในหน้า Dashboard
export async function getScheduleRowsForMonth(year: number, month: number): Promise<CalibrationScheduleRow[]> {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);

  const schedules = await prisma.schedule.findMany({
    where: { scheduledDate: { gte: start, lte: end } },
    orderBy: { scheduledDate: "asc" },
    select: {
      scheduledDate: true,
      maintenanceDetail: {
        select: {
          registrationNumber: true,
          profile: { select: { name: true, project: { select: { name: true } } } },
        },
      },
    },
  });

  return schedules.map((s) => ({
    registrationNumber: s.maintenanceDetail.registrationNumber,
    instrumentName: s.maintenanceDetail.profile.name,
    projectName: s.maintenanceDetail.profile.project.name,
    scheduledDate: s.scheduledDate.toISOString(),
  }));
}
